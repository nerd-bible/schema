import { rmSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import * as sample from "../typescript/sample.ts";
import { functions, ingest } from "./index.ts";

export function openDb(rmExisting = false): DatabaseSync {
	const fname = "sample.db";
	if (rmExisting) rmSync(fname, { force: true });
	const db = new DatabaseSync(fname, { open: true });
	db.function("stemmer", { deterministic: true }, functions.stemmer);
	db.function("spanContains", { deterministic: true }, functions.spanContains);
	return db;
}

if (import.meta.main) {
	const db = openDb(true);

	ingest.schema(db);
	db.exec("begin;");
	ingest.documents(db, sample.gen);
	ingest.documents(db, sample.exo);
	db.exec("commit;analyze;");
	// Test triggers
	// db.exec("update word set id=180 where doc=2 and id=172");
}
