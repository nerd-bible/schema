import { DatabaseSync } from "node:sqlite";
import { unlinkSync, writeFileSync } from "node:fs";
import * as sqlite from "./sqlite.ts";
import sample from "./bible-sample.ts";

unlinkSync("foo.db");
const db = new DatabaseSync("foo.db", { open: true });
db.exec(sqlite.document);
db.exec(sqlite.word);
db.exec(sqlite.grammar);
db.exec(sqlite.source);
db.exec(sqlite.block);
db.exec(sqlite.span);

db.exec(
	`insert into document (id, book) values (${sample.document.id}, '${sample.document.book}')`,
);

// create csvs
const batchSize = 10_000;

for (let i = 0; i < sample.words.length; i += batchSize) {
	const batch = sample.words.slice(i, i + batchSize);
	const values = batch
		.map(
			(w) =>
				`(${[w.doc, w.id, w.before, w.text, w.lang, w.after].map((v) => (typeof v === "string" ? `'${v}'` : v)).join(",")})`,
		)
		.join(",");
	db.exec(`insert into word (doc, id, before, text, lang, after) values ${values}`);
}

// sample.blocks
// 	.map((b) => [b.doc, b.word, b.tag, b.depth, b.attrs].join("\t"))
