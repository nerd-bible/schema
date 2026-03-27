import { DatabaseSync } from "node:sqlite";
import { rmSync } from "node:fs";
import { schemas, ingest, functions } from "./sqlite/index.ts";
import * as sample from "./bible-sample.ts";
import * as schema from "./typescript.ts";

const fname = "sample.db";
rmSync(fname, { force: true });
const db = new DatabaseSync(fname, { open: true });
// Use until have custom sqlite build.
db.function("stemmer", { deterministic: true }, functions.stemmer);
db.exec(schemas.document);
db.exec(schemas.word);
db.exec(schemas.grammar);
db.exec(schemas.source);
db.exec(schemas.block);
db.exec(schemas.span);
db.exec("begin;");

function insertDocument(doc: schema.All) {
	ingest.insertRows(db, "document", [doc.document]);
	ingest.insertRows(db, "word", doc.words);
	ingest.insertRows(db, "block", doc.blocks);
}

insertDocument(sample.gen);
insertDocument(sample.exo);

db.exec(schemas.indices);
db.exec("commit;analyze;");
