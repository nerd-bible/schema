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
		exec: (sql: string) => db.exec(sql),
		run: (sql: string) => db.prepare(sql, { readBigInts: true }).all(),
	};
}

if (import.meta.main) {
	const db = openDb(true);

	ingest.schema(db);
	console.log(db.run("select sqlite_version();"));
	db.exec("begin;");
	ingest.documents(db, sample.gen);
	ingest.documents(db, sample.exo);
	db.exec("end;analyze;");
	// Test triggers
	// db.exec("update word set id=180 where doc=2 and id=172");
	validate(db);
}
