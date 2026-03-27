export type Serializable = string | number | object;
export const serialize = {
	value(v: Serializable): string {
		if (v == null) return "NULL";
		switch (typeof v) {
			case "number":
				return v.toString();
			case "string":
				return `'${v}'`;
			case "object":
				return `jsonb(${serialize.value(JSON.stringify(v))})`;
			default:
				throw new Error("cannot serialize" + v);
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
export function insertRows(
	db: Db,
	table: string,
	rows?: Record<string, Serializable>[],
	batchSize = 10_000,
) {
	if (!rows) return;

	const columns = Object.keys(rows[0] ?? []);
	for (let i = 0; i < rows.length; i += batchSize) {
		const batch = rows.slice(i, i + batchSize);
		const q = "insert into " + table + serialize.rows(columns, batch);
		try {
			db.exec(q);
		} catch (err) {
			console.error(table, "batch", i, q.substring(0, 1000));
			console.error(err);
			throw err;
		}
	}
}
