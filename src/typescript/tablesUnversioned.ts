import * as v from "@nerd-bible/valio";
import { bigint } from "./valio.ts";

const docId = bigint().register("col", "REFERENCES doc(id)");
// Search.
// This caching table is needed because:
// 1. Search uses a sequence algorithm that requires selecting adjacent words.
//    That would normally requires a full table scan, but with this it doesn't.
// 2. Words are mapped 0->N during normalization.
//
// This table should NOT be version controlled.
export const wordSearch = v
	.object({
		doc: docId,
		word: bigint(),
		wordEnd: bigint(), // in case of N->1 mapping (i.e. one hundred ten -> 110)

		plane: v.number(),
		pos: bigint(),
		stem: v.string(),
	})
	.register(
		"table",
		[
			"PRIMARY KEY (doc, word)",
			"FOREIGN KEY (doc, word) REFERENCES word(doc, id)",
			"FOREIGN KEY (doc, wordEnd) REFERENCES word(doc, id)",
		].join(",\n\t"),
	)
	.register(
		"extra",
		[
			"CREATE INDEX wordSearchPos ON wordSearch(pos)",
			"CREATE INDEX wordSearchStem ON wordSearch(stem)",
		].join(";\n"),
	);
export type WordSearch = v.Output<typeof wordSearch>;

// Ideally `wordSearch` would be a materialized view, but SQLite doesn't
// support those. Instead we use this table with triggers inserting into it to
// tell the application when it needs to regenerate the search table.
// TODO: store more fine-grained info to speed up large document regeneration
const insertWordInvalid = (op: string) =>
	`INSERT INTO wordSearchInvalid (doc) VALUES (${op == "DELETE" ? "old" : "new"}.doc) ON CONFLICT DO NOTHING;`;
export const wordSearchInvalid = v.object({ doc: docId }).register(
	"extra",
	["INSERT", "DELETE", "UPDATE"]
		.map(
			(op) =>
				`CREATE TRIGGER word${op} AFTER ${op} ON word BEGIN ${insertWordInvalid(op)} END`,
		)
		.concat(
			`CREATE TRIGGER docUpdate AFTER UPDATE OF lang ON doc BEGIN ${insertWordInvalid("UPDATE")} END`,
		)
		.join(";\n"),
);
