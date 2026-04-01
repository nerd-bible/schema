import { DatabaseSync } from "node:sqlite";
import { rmSync } from "node:fs";
import { schemas, ingest, functions } from "./index.ts";
import * as sample from "../typescript/sample.ts";
import * as schema from "../typescript/schema.ts";

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
db.exec(schemas.wordSearch);
db.exec(schemas.triggers);
db.exec("begin;");


function insertDocument(doc: schema.PublicationAll) {
	console.dir(doc, { depth: null });
	ingest.insertRows(db, "document", [doc.document]);
	ingest.insertRows(db, "word", doc.words);
	ingest.insertRows(db, "block", doc.blocks);
}

insertDocument(sample.gen);
insertDocument(sample.exo);

db.exec(schemas.indices);
db.exec("commit;analyze;");
// db.exec("update word set id=180 where doc=2 and id=172");
