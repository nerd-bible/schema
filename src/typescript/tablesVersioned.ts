import * as v from "@nerd-bible/valio";
import { bigint } from "./valio.ts";

const lang = v.string(); // ISO-639
const id = bigint().register("col", "PRIMARY KEY");

// TODO: canon and book groups: https://en.wikipedia.org/wiki/Biblical_canon
// List of words with stable ids that can be searched.
export const doc = v
	.object({
		id,
		lang, // ISO 639 used for sentence and default word segmentation
	})
	.extendPartial({
		name: v.string(),
		urls: v.array(v.string()),
	});
export type Doc = v.Output<typeof doc>;

export const publication = v
	.object({
		doc: bigint().register("col", "PRIMARY KEY REFERENCES doc(id)"),
		code: v.string(), // publisher defined, like BSB, ESV, etc.
	})
	.extendPartial({
		book: v.string(), // https://ubsicap.github.io/usfm/identification/books.html
		published: v.date(),
	});
export type Publication = v.Output<typeof publication>;

// Document content
// collision chance for 100k ids:
// 32 bit = .69
// 53 bit = 5.5e-7 <- Max safe integer, requires JS bigint to generate
// 64 bit = 2.7e-10 <- Requires JS bigint to generate and read
// https://kevingal.com/apps/collision.html
const docId = bigint().register("col", "REFERENCES doc(id)");
export const word = v
	.object({
		doc: docId,
		id: bigint(),
	})
	.extendPartial({
		lang: v.string(),
		text: v.string(),
	})
	.register("table", "PRIMARY KEY (doc, id)")
	.register("extra", "CREATE INDEX wordLangText ON word(lang, text)");
export type Word = v.Output<typeof word>;

export const grammar = v
	.object({
		owner: docId,
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
			"PRIMARY KEY (owner, doc, word)",
			"FOREIGN KEY (doc, word) REFERENCES word(doc, id)",
		].join(",\n\t"),
	);
export type Grammar = v.Output<typeof grammar>;

// Formatting and notes.
export const mark = v
	.object({
		owner: docId,
		doc: docId,
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
	// .register(
	// 	"table",
	// 	[
	// 		"PRIMARY KEY (doc, word)",
	// 		"FOREIGN KEY (doc, word) REFERENCES word(doc, id)",
	// 		"FOREIGN KEY (doc, wordEnd) REFERENCES word(doc, id)",
	// 	].join(",\n\t"),
	// )
	.register(
		"extra",
		[
			"CREATE INDEX markStart ON mark(owner, start, data)",
			"CREATE INDEX markEnd ON mark(owner, end, data)",
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
export const highlight = v.object({ id, name: v.string() }).extendPartial({
	backgroundColor: v.string(),
	textDecoration: v.string(),
});
export type Highlight = v.Output<typeof highlight>;
