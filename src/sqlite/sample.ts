import { rmSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import * as sample from "../typescript/sample.ts";
import { functions, ingest } from "./index.ts";
import type { Db } from "./ingest.ts";
import { validate } from "./validate.ts";

export function openDb(rmExisting = false): Db {
	const fname = "sample.db";
	if (rmExisting) rmSync(fname, { force: true });
	const db = new DatabaseSync(fname, { open: true });
	db.function("stemmer", { deterministic: true }, functions.stemmer);
	db.function("spanContains", { deterministic: true }, functions.spanContains);
	return {
		exec: async (sql: string) => db.exec(sql),
		run: async (sql: string) => db.prepare(sql, { readBigInts: true }).all(),
	};
}

if (import.meta.main) {
	const db = openDb(true);
	console.log(await db.run("select sqlite_version();"));

	await ingest.schema(db);
	await db.exec("begin;");
	await ingest.documents(db, sample.gen);
	await ingest.documents(db, sample.exo);
	await db.exec("end;analyze;");
	await validate(db);
}
