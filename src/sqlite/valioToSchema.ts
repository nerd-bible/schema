import * as v from "@nerd-bible/valio";

function valioToSqlite(obj: v.Pipe, nullable = false) {
	const extra = nullable ? "" : " NOT NULL";

	if (
		obj instanceof v.ValioObject ||
		obj instanceof v.ValioArray ||
		obj instanceof v.ValioRecord
	)
		return "ANY" + extra;

	if (obj instanceof v.Union) {
		if (obj.options.length == 2) {
			const undefinedIndex = obj.options.indexOf(
				(o: v.Pipe) => o instanceof v.ValioUndefined,
			);
			const definedIndex = undefinedIndex == 0 ? 1 : 0;
			if (undefinedIndex) return valioToSqlite(obj.options[definedIndex], true);
		}
		return "ANY" + extra;
	}

	if (
		obj instanceof v.ValioNumber ||
		obj instanceof v.ValioDate ||
		obj instanceof v.ValioBoolean ||
		obj instanceof v.ValioBigInt
	)
		return "INTEGER" + extra;
	if (
		obj instanceof v.ValioString ||
		obj instanceof v.ValioEnum ||
		obj instanceof v.ValioLiteral
	)
		return "TEXT" + extra;

	if (obj instanceof v.ValioAny) return "ANY" + extra;

	console.error(obj);
	throw new Error("cannot schema");
}

export function createTableToSqlite(name: string, obj: v.ValioObject<any>) {
	let res = `CREATE TABLE IF NOT EXISTS ${name} (\n\t`;
	let hasPrimaryKey = false;

	for (const key in obj.shape) {
		const val = obj.shape[key];
		res += `${key} ${valioToSqlite(val)}`;

		const colExtra: string | undefined = val.registry["col"];
		if (colExtra) res += ` ${colExtra}`;
		if (colExtra?.includes("PRIMARY")) hasPrimaryKey = true;
		res += ",\n\t";
	}

	const tableExtra: string | undefined = obj.registry["table"];
	if (tableExtra) {
		res += `\n\t${tableExtra}`;
		if (tableExtra?.includes("PRIMARY")) hasPrimaryKey = true;
	} else res = res.substring(0, res.length - 3);

	res += "\n) STRICT";
	if (hasPrimaryKey) res += ", WITHOUT ROWID";
	res += ";";
	const extra: string | undefined = obj.registry["extra"];
	if (extra) {
		res += `\n${extra}`;
		if (!extra.endsWith(";")) res += ";";
	}

	return res;
}
