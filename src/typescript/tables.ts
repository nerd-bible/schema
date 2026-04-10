import * as v from "@nerd-bible/valio";
import { bigint } from "./valio.ts";

const lang = v.string(); // ISO-639
const id = bigint().register("col", "PRIMARY KEY");

// TODO: canon and book groups: https://en.wikipedia.org/wiki/Biblical_canon

// Publication or note.
export const doc = v.object({
	id,
	lang, // ISO 639 used for sentence and default word segmentation
});
export type Doc = v.Output<typeof doc>;

export const publication = v
	.object({
		doc: bigint().register("col", "PRIMARY KEY REFERENCES doc(id)"),
		// TODO: add check?
		book: v.string(), // https://ubsicap.github.io/usfm/identification/books.html
		code: v.string(), // publisher defined, like BSB, ESV, etc.
	})
	.extendPartial({
		published: v.date(),
		url: v.string(),
	});
export type Publication = v.Output<typeof publication>;

// Document content
// collision chance for 100k ids:
// 32 bit = .69
// 53 bit = 5.5e-7 <- Max safe integer, requires JS bigint to generate
// 64 bit = 2.7e-10 <- Requires JS bigint to generate and read
// https://kevingal.com/apps/collision.html
const docId = bigint().register("col", "REFERENCES doc(id)");
// const voidWord = v.union([
// 	v.object({ lang: v.literal("hr") }),
// 	v.object({ lang: v.enum(["c", "v"]), text: v.string() }),
// ]);
// const normWord = v.object({ text: v.string() }).extendPartial({
// 	lang: v.string().length(3), // NULL means same as doc.lang
// });
export const word = v
	.object({
		doc: docId,
		id: bigint(),
	})
	// really is voidWord | normWord, but no great way to map to SQLite
	.extendPartial({
		lang: v.string(),
		text: v.string(),
	})
	.register("table", "PRIMARY KEY (doc, id)")
	.register("extra", "CREATE INDEX wordLangText ON word(lang, text)");
export type Word = v.Output<typeof word>;

export const grammar = v
	.object({
		doc: docId,
		word: bigint(),
	})
	.extendPartial({
		// conllu fields
		lemma: v.string(),
		upos: v.string(),
		xpos: v.string(),
		feats: v.record(v.string(), v.string()),
		misc: v.record(v.string(), v.string()),
	})
	.register(
		"table",
		[
			"PRIMARY KEY (doc, word)",
			"FOREIGN KEY (doc, word) REFERENCES word(doc, id)",
		].join(",\n\t"),
	);
export type Grammar = v.Output<typeof grammar>;

// Formatting and notes.
export const mark = v
	.object({
		doc: bigint().register("col", "REFERENCES doc(id)"),
		start: bigint(), // inclusive

		tag: v.enum([
			"p", // paragraph
			"c", // chapter
			"v", // verse
			"h", // heading
			"ol", // ordered list
			"ul", // unordered list
			"li", // list item
			"q", // quote
			"em", // emphasis (italic)
			"strong", // strong (bold)
			"pn", // publisher note
			"un", // user note
		]),
	})
	.extendPartial({
		data: v.any(),
		end: bigint(), // inclusive
	})
	.register(
		"extra",
		[
			"CREATE INDEX markStart ON mark(start)",
			"CREATE INDEX markEnd ON mark(end)",
		].join(";\n"),
	);
export type Mark = v.Output<typeof mark>;

// Annotations.
export const docTag = v
	.object({
		doc: docId,
		tag: v.string(),
	})
	.extendPartial({ value: v.any() })
	.register("table", "PRIMARY KEY (doc, tag)")
	.register("extra", "CREATE INDEX docTagTag ON docTag(tag)");
export type DocTag = v.Output<typeof docTag>;
export const highlight = v
	.object({ id, name: v.string() })
	.extendPartial({
		backgroundColor: v.string(),
		textDecoration: v.string(),
	});
export type Highlight = v.Output<typeof highlight>;

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
