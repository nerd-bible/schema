import { rmSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import type { Builder } from "../typescript/builder.ts";
import * as sample from "../typescript/sample.ts";
import { functions, ingest, schema } from "./index.ts";

const fname = "sample.db";
rmSync(fname, { force: true });
const db = new DatabaseSync(fname, { open: true });
db.function("stemmer", { deterministic: true }, functions.stemmer);
db.exec(schema.doc);
db.exec(schema.publication);
db.exec(schema.word);
db.exec(schema.grammar);
db.exec(schema.source);
db.exec(schema.span);

db.exec(schema.wordSearch);
db.exec(schema.wordSearchInvalidation);
db.exec(schema.triggers);
db.exec("begin;");

function insertDocument(doc: Builder) {
	ingest.insertRows(db, "doc", [doc.doc]);
	if (doc.publication) ingest.insertRows(db, "publication", [{
		id: doc.doc.id,
		...doc.publication
	}]);
	ingest.insertRows(db, "word", doc.words);
	ingest.insertRows(db, "grammar", doc.grammars);
	ingest.insertRows(db, "source", doc.sources);
	ingest.insertRows(db, "span", doc.spans);
}

insertDocument(sample.gen);
insertDocument(sample.exo);

schema.indices.forEach(i => db.exec(i));
db.exec("commit;analyze;");
// db.exec("update word set id=180 where doc=2 and id=172");
