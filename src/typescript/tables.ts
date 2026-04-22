import * as v from "@nerd-bible/valio";
import * as ref from "@nerd-bible/ref";

// collision chance for 100k ids:
// 32 bit = .69
// 53 bit = 5.5e-7 <- Max safe integer, requires JS bigint to generate
// 64 bit = 2.7e-10 <- Requires JS bigint to generate and read
// https://kevingal.com/apps/collision.html
const id = v.bigint().register("col", "PRIMARY KEY");
const docId = v.bigint().register("col", "REFERENCES doc(id)");
const lang = v.string(); // ISO-639
const book = v.enum(ref.book.ids); // if scripture
export type Book = v.Output<typeof book>;

// A namespace for all other tables to allow layering without branching.
export const doc = v.object({ id, lang }).extendPartial({ title: v.string() });
export type Doc = v.Output<typeof doc>;
export const docTag = v
	.object({ doc: docId, tag: v.string() })
	.extendPartial({ data: v.any() })
	.register("extra", "CREATE INDEX IF NOT EXISTS docTagTag ON docTag(tag, data)");
export type DocTag = v.Output<typeof docTag>;
export const scripture = v
	.object({
		doc: v.bigint().register("col", "PRIMARY KEY REFERENCES doc(id)"),
		book,
		code: v.string(),
	})
	.extendPartial({ published: v.date(), urls: v.array(v.string()) });
export type Scripture = v.Output<typeof scripture>;
export const outline = v.object({
	doc: docId,
	scripture: v.bigint().register("col", "REFERENCES scripture(doc)"),
	chapter: v.number(),
	verse: v.number(),
	level: v.number(),
	text: v.string(),
});
export type Outline = v.Output<typeof outline>;
export const highlight = v
	.object({ doc: docId, id: v.bigint() })
	.extendPartial({
		name: v.string(),
		backgroundColor: v.string(),
		textDecoration: v.string(),
	})
	.register("table", "PRIMARY KEY (doc, id)");
export type Highlight = v.Output<typeof highlight>;
export const note = v
	.object({ doc: docId, ref: docId, refStart: v.bigint() })
	.extendPartial({ refEnd: v.bigint(), highlight: v.bigint() })
	.register(
		"table",
		"FOREIGN KEY (doc, highlight) REFERENCES highlight(doc, id)",
	)
	.register("extra", "CREATE INDEX IF NOT EXISTS noteDoc ON note(ref, refStart);");
export type Note = v.Output<typeof note>;
export const xref = v
	.object({
		doc: docId,
		src: docId,
		srcStart: v.bigint(),
		dest: docId,
		tag: v.string(),
	})
	.extendPartial({
		srcEnd: v.bigint(),
		destStart: v.bigint(),
		destEnd: v.bigint(),
	})
	.register(
		"table",
		[
			"FOREIGN KEY (src, srcStart) REFERENCES word(doc, id)",
			"FOREIGN KEY (src, srcEnd) REFERENCES word(doc, id)",
			"FOREIGN KEY (dest, destStart) REFERENCES word(doc, id)",
			"FOREIGN KEY (dest, destEnd) REFERENCES word(doc, id)",
		].join(",\n\t"),
	);
export type Xref = v.Output<typeof xref>;

// Document content
export const word = v
	.object({ doc: docId, id: v.bigint() })
	.extendPartial({ lang: v.string(), text: v.string() })
	.register("table", "PRIMARY KEY (doc, id)")
	.register("extra", "CREATE INDEX IF NOT EXISTS wordLangText ON word(lang, text)");
export type Word = v.Output<typeof word>;
export const mark = v
	.object({
		doc: docId,
		start: v.bigint(), // inclusive
		tag: v.enum([
			"p", // paragraph
			"c", // chapter
			"v", // verse
			"ol", // ordered list
			"ul", // unordered list
			"li", // list item
			"q", // quote
			"h", // heading
			"em", // emphasis (italic)
			"strong", // strong (bold)
			"ref", // bcv
		]),
	})
	.extendPartial({
		data: v.any(),
		end: v.bigint(), // inclusive
	})
	.register(
		"extra",
		[
			"CREATE INDEX IF NOT EXISTS markStart ON mark(start, tag)",
			"CREATE INDEX IF NOT EXISTS markEnd ON mark(end, tag)",
		].join(";\n"),
	);
export type Mark = v.Output<typeof mark>;

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
		word: v.bigint(),

		plane: v.number(),
		pos: v.bigint(),
		stem: v.string(),
	})
	.extendPartial({
		wordEnd: v.bigint(), // in case of N->1 mapping (i.e. one hundred ten -> 110)
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
			"CREATE INDEX IF NOT EXISTS wordSearchPos ON wordSearch(pos)",
			"CREATE INDEX IF NOT EXISTS wordSearchStem ON wordSearch(stem)",
		].join(";\n"),
	);
export type WordSearch = v.Output<typeof wordSearch>;

// Ideally `wordSearch` would be a materialized view, but SQLite doesn't
// support those. Instead we use this table with triggers inserting into it to
// tell the application when it needs to regenerate the search table.
// TODO: store more fine-grained info to speed up large document regeneration
const insertWordInvalid = (op: string) =>
	`INSERT INTO wordSearchInvalid (doc) VALUES (${op == "DELETE" ? "old" : "new"}.doc) ON CONFLICT DO NOTHING;`;
export const wordSearchInvalid = v
	.object({ doc: v.bigint().register("col", "PRIMARY KEY REFERENCES doc(id)") })
	.register(
		"extra",
		["INSERT", "DELETE", "UPDATE"]
			.map(
				(op) =>
					`CREATE TRIGGER IF NOT EXISTS word${op} AFTER ${op} ON word BEGIN ${insertWordInvalid(op)} END`,
			)
			.concat(
				`CREATE TRIGGER IF NOT EXISTS docUpdate AFTER UPDATE OF lang ON doc BEGIN ${insertWordInvalid("UPDATE")} END`,
			)
			.join(";\n"),
	);
