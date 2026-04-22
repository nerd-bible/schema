import type { Builder } from "../typescript/builder.ts";
import * as tables from "../typescript/tables.ts";
import { createTableToSqlite } from "./valioToSchema.ts";

export type Serializable = string | number | object | bigint;
export const serialize = {
	value(v: Serializable): string {
		if (v == null) return "NULL";
		switch (typeof v) {
			case "number":
			case "bigint":
				return v.toString();
			case "string":
				return `'${v}'`;
			case "object":
				if (v instanceof Date) return (v.getTime() / 1000).toString();
				return `jsonb(${serialize.value(JSON.stringify(v))})`;
			case "boolean":
				return v ? "1" : "0";
			default:
				throw new Error("cannot serialize " + v);
		}
	},
	row: (row: Serializable[]) => `(${row.map(serialize.value).join(",")})`,
	rows: (props: string[], rows: Record<string, Serializable>[]) =>
		`(${props.join(",")}) values ${rows
			.map((w) => serialize.row(props.map((p) => w[p])))
			.join(",")}`,
};

export type Db = {
	exec(query: string): Promise<void>;
	run(query: string): Promise<Record<string, any>[]>;
};

export async function schema(db: Db) {
	for (const k in tables) {
		const sql = createTableToSqlite(k, (tables as any)[k]);
		// https://dbdiagram.io/d
		// console.log(
		// 	sql
		// 		.replace(/STRICT,?/g, "")
		// 		.replace(/WITHOUT ROWID,?/g, "")
		// 		.replaceAll("ANY", "BLOB"),
		// );
		await db.exec(sql);
	}
}

export async function rows(
	db: Db,
	table: string,
	rows?: Record<string, Serializable>[],
	batchSize = 10_000,
) {
	if (!rows) return;

	const columns = Object.keys(rows[0] ?? []);
	for (let i = 0; i < rows.length; i += batchSize) {
		const batch = rows.slice(i, i + batchSize);
		const q = "insert into " + table + serialize.rows(columns, batch) + ";";
		try {
			await db.exec(q);
		} catch (err) {
			console.error(table, "batch", i, q.substring(0, 1000));
			console.error(err);
			throw err;
		}
	}
}

export async function documents(db: Db, b: Builder) {
	await rows(db, "doc", b.docs);
	for (const w of b.docWords.values()) await rows(db, "word", w);
	for (const m of b.docMarks.values()) await rows(db, "mark", m);

	await rows(db, "docTag", b.docTags);
	await rows(db, "scripture", b.scriptures);
	await rows(db, "outline", b.outlines);
	await rows(db, "highlight", b.highlights);
	await rows(db, "note", b.notes);
	await rows(db, "xref", b.xrefs);
}
