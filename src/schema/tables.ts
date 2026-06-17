import * as v from "@nerd-bible/valio";
import * as ref from "@nerd-bible/ref";

// collision chance for 100k ids:
// 32 bit = .69
// 53 bit = 5.5e-7 <- Max safe integer, requires JS bigint to generate
// 64 bit = 2.7e-10 <- Requires JS bigint to generate and read
// https://kevingal.com/apps/collision.html
const docId = v.bigint().register("col", "REFERENCES doc(id)");
// For other tables to allow layering.
const namespaceId = v.bigint().register("col", "REFERENCES namespace(id)");
const lang = v.string(); // ISO-639
export type Lang = v.Output<typeof lang>;
const book = v.enum(ref.book.ids); // if scripture
export type Book = v.Output<typeof book>;

export const namespace = v
	.object({ id: v.bigint().register("col", "PRIMARY KEY"), name: v.string() })
	.extendPartial({ short: v.string() });
export type Namespace = v.Output<typeof namespace>;

export const doc = v
	.object({
		namespace: namespaceId,
		id: v.bigint().register("col", "PRIMARY KEY"),
		lang,
	})
	.extendPartial({
		createdAt: v.date(),
		book, // if scripture
		title: v.string(),
	});
export type Doc = v.Output<typeof doc>;
// User tags and mark styles.
export const docTag = v
	.object({ doc: docId, tag: v.string() })
	.extendPartial({ data: v.any() });
export type DocTag = v.Output<typeof docTag>;

// Document content
export const word = v
	.object({ doc: docId, pos: v.bigint(), text: v.string() })
	.register("table", "PRIMARY KEY (doc, pos)");
export type Word = v.Output<typeof word>;
// h1 is reserved for `doc.title`
// Use `outline` instead of h2-h6 in scripture.
export const block = v
	.object({
		namespace: namespaceId,
		doc: docId,
		id: v.bigint(),
		pos: v.bigint(),
		tag: v.enum(["p", "q", "h2", "h3", "h4", "h5", "h6", "ol", "ul"]),
	})
	.extendPartial({
		parent: v.bigint(),
		data: v.any(),
	})
	.register(
		"table",
		[
			"PRIMARY KEY (namespace, doc, id)",
			"FOREIGN KEY (namespace, doc, parent) REFERENCES block(namespace, doc, id)",
		].join(",\n\t"),
	);
export type Block = v.Output<typeof block>;

// Document annotations
export const outline = v
	.object({
		namespace: namespaceId,
		doc: docId,
		id: v.bigint(),
		pos: v.bigint(),
		chapter: v.number(),
		verse: v.number(),
	})
	.extendPartial({ parent: v.bigint(), text: docId })
	.register(
		"table",
		[
			"PRIMARY KEY (namespace, doc, id)",
			"FOREIGN KEY (namespace, doc, parent) REFERENCES outline(namespace, doc, id)",
		].join(",\n\t"),
	);
export type Outline = v.Output<typeof outline>;
export const mark = v
	.object({
		namespace: namespaceId,
		doc: docId,
		tag: v.string(),
		start: v.bigint(),
	})
	.extendPartial({
		end: v.bigint(),
		data: v.any(),
	});
export type Mark = v.Output<typeof mark>;

// Cross references
export const xref = v
	.object({
		namespace: namespaceId,
		fromDoc: docId,
		fromStart: v.bigint(),
		toDoc: docId,
		toStart: v.bigint(),
	})
	.extendPartial({
		fromEnd: v.bigint(),
		toEnd: v.bigint(),
	});
export type Xref = v.Output<typeof xref>;
export const xrefTag = v
	.object({ namespace: namespaceId, doc: docId, tag: v.string() })
	.extendPartial({ data: v.any() });
export type XRefTag = v.Output<typeof xrefTag>;

// This caching table is needed because:
// 1. Search uses a sequence algorithm that requires selecting adjacent words.
//    That requires a full table scan, but with this it doesn't.
// 2. Words are mapped 1 -> 0..N during normalization.
//
// This table should NOT be version controlled.
export const wordSearch = v
	.object({
		doc: docId,
		word: v.bigint(),

		plane: v.number(), // Create boundaries sequences can't match across.
		pos: v.bigint(),
		stem: v.string(),
	})
	.extendPartial({
		wordEnd: v.bigint(), // in case of N->1 mapping (i.e. one hundred ten -> 110)
	})
	.register(
		"table",
		[
			"PRIMARY KEY (doc, pos)",
			"FOREIGN KEY (doc, word) REFERENCES word(doc, pos)",
			"FOREIGN KEY (doc, wordEnd) REFERENCES word(doc, pos)",
		].join(",\n\t"),
	)
	.register(
		"extra",
		"CREATE INDEX IF NOT EXISTS wordSearchStem ON wordSearch(stem)",
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
