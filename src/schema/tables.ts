import * as v from "@nerd-bible/valio";
import * as bref from "@nerd-bible/ref";

// collision chance for 100k ids:
// 32 bit = .69
// 53 bit = 5.5e-7 <- Max safe integer, requires JS bigint to generate
// 64 bit = 2.7e-10 <- Requires JS bigint to generate and read
// https://kevingal.com/apps/collision.html
const docId = v.bigint().register("col", "REFERENCES doc(id)");

const lang = v.string().length(3); // ISO-639-3
export type Lang = v.Output<typeof lang>;
const book = v.enum(bref.book.ids); // if scripture
export type Book = v.Output<typeof book>;

// Heavily based on the
// [Wordgard model](https://wordgard.net/docs/guide/#h-documents)
// - Doc = Plot[]
// - Plot = { tag: string, inline: boolean, children: Plot[] | Leaf[] }
// - Leaf = { tag: string, attrs: any, text?: string }
// Differences from the Wordgard model:
// - identified by a sorted, unique, and stable absolute position identifier
// - Leaf = Word | Ref
// - Marks are defined by pos instead of node
export const doc = v
	.object({
		id: v.bigint().register("col", "PRIMARY KEY"),
		lang,
	})
	.extendPartial({
		createdAt: v.date(),
		book, // if scripture
		title: v.string(),
	});
export type Doc = v.Output<typeof doc>;
export const plot = v
	.object({
		doc: docId,
		start: v.bigint(),
		end: v.bigint(),
		tag: v.string(),
	})
	.extendPartial({
		parent: v.bigint(),
		attrs: v.any(),
	})
	.register(
		"table",
		[
			"PRIMARY KEY (doc, pos)",
			"FOREIGN KEY (doc, parent) REFERENCES plot(doc, start)",
		].join(",\n\t"),
	);
export type Plot = v.Output<typeof plot>;
export const word = v
	.object({
		doc: docId,
		pos: v.bigint(),
		text: v.string(),
	})
	.extendPartial({
		stem: v.string(),
		embedding: v.any(),
	})
	.register(
		"table",
		[
			"PRIMARY KEY (doc, pos)",
			"FOREIGN KEY (doc, parent) REFERENCES plot(doc, pos)",
		].join(",\n\t"),
	)
	.register(
		"extra",
		[
			"CREATE INDEX IF NOT EXISTS leafText ON leaf(doc, text)",
			"CREATE INDEX IF NOT EXISTS leafStem ON leaf(doc, stem)",
			"CREATE INDEX IF NOT EXISTS leafTag ON leaf(doc, tag, text)",
		].join(";\n"),
	);
export type Word = v.Output<typeof word>;
export const ref = v
	.object({
		doc: docId,
		chapter: v.number(),
		verse: v.number(),
		pos: v.bigint(),
	})
	.register("table", "PRIMARY KEY (doc, chapter, verse)");

// Annotations
export const mark = v
	.object({
		doc: docId,
		id: v.bigint(),
		tag: v.string(),
		start: v.bigint(),
	})
	.extendPartial({
		end: v.bigint(),
		attrs: v.any(),
	})
	.register("table", "PRIMARY KEY (doc, id)");
export type Mark = v.Output<typeof mark>;
export const xref = v
	.object({
		id: v.bigint().register("col", "PRIMARY KEY"),
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

// Collections
const collectionId = v.bigint().register("col", "REFERENCES namespace(id)");
export const collection = v
	.object({ id: v.bigint().register("col", "PRIMARY KEY"), name: v.string() })
	.extendPartial({ shortname: v.string(), attrs: v.any() });
export type Collection = v.Output<typeof collection>;
export const docCollection = v.object({ doc: docId, collection: collectionId });
export const markCollection = v
	.object({ doc: docId, mark: v.bigint(), collection: collectionId })
	.register("table", "FOREIGN KEY (doc, mark) REFERENCES mark(doc, id)");
export const xrefCollection = v.object({
	xref: v.bigint().register("col", "REFERENCES xref(id)"),
	collection: collectionId,
});
