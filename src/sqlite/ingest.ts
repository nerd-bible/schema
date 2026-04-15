import type { Builder} from "../typescript/builder.ts";
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
	exec(query: string): void;
};

export function schema(db: Db) {
	for (const k in tables) {
		const sql = createTableToSqlite(k, (tables as any)[k]);
		// https://dbdiagram.io/d
		// console.log(
		// 	sql
		// 		.replace(/STRICT,?/g, "")
		// 		.replace(/WITHOUT ROWID,?/g, "")
		// 		.replaceAll("ANY", "BLOB"),
		// );
		db.exec(sql);
	}
}

export function rows(
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
			db.exec(q);
		} catch (err) {
			console.error(table, "batch", i, q.substring(0, 1000));
			console.error(err);
			throw err;
		}
	}
}

export function documents(db: Db, b: Builder) {
	rows(db, "doc", b.docs);
	for (const w of b.docWords.values()) rows(db, "word", w);
	for (const m of b.docMarks.values()) rows(db, "mark", m);

	rows(db, "docTag", b.docTags);
	rows(db, "scripture", b.scriptures);
	rows(db, "outline", b.outlines);
	rows(db, "highlight", b.highlights);
	rows(db, "note", b.notes);
	rows(db, "xref", b.xrefs);
}
