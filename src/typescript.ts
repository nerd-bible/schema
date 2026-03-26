import * as v from "@nerd-bible/valio";

export const docId = v.number();
export type DocId = v.Output<typeof docId>;
export const id = v.number().neq(0);
export type Id = v.Output<typeof id>;

export const document = v
	.object({
		id: docId,
		book: v.string(),
		shortcode: v.string(),
		published: v.date(),
		publishedErrorDays: v.number(),
	})
	.partial({
		book: true,
		shortcode: true,
		published: true,
		publishedErrorDays: true,
	});
export type Document = v.Output<typeof document>;

export const word = v.object({
	doc: docId,
	id,
	before: v.string(), // punctuation
	text: v.string(),
	lang: v.string(),
	after: v.string(), // punctuation
});
export type Word = v.Output<typeof word>;

export const grammar = v
	.object({
		lemma: v.string(), // concordance
		upos: v.string(),
		xpos: v.string(),
		feats: v.record(v.string(), v.string()),
		misc: v.record(v.string(), v.string()),
	})
	.partial();
export type Grammar = v.Output<typeof grammar>;

export const source = v.object({
	doc: docId,
	word: id,
	srcDoc: docId,
	srcWord: id,
});
export type Source = v.Output<typeof source>;

// Blocks can nest and go BEFORE the word.
export const block = v.object({
	doc: docId,
	word: id,
	depth: v.number(), // must match HTML
	tag: v.enum([
		"p",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"ol",
		"ul",
		"li",
		"hr",
		"c",
		"v",
	]),
	attrs: v.object({
		class: v.string(),
		dir: v.enum(["ltr", "rtl"]),
	}),
}).partial({ attrs: true });
export type Block = v.Output<typeof block>;

export const span = v.object({
	doc: docId,
	startWord: v.number(),
	endWord: v.number(),
	value: v.union([
		v.object({ tag: v.literal("quote"), cite: v.string() }),
		v.object({ tag: v.literal("em") }),
		v.object({ tag: v.literal("strong") }),
	]),
});
export type Span = v.Output<typeof span>;

export const all = v
	.object({
		document,
		words: v.array(word),
		grammars: v.array(grammar),
		sources: v.array(source),
		blocks: v.array(block),
		spans: v.array(span),
	})
	.partial({
		words: true,
		grammars: true,
		sources: true,
		blocks: true,
		spans: true,
	});
export type All = v.Output<typeof all>;
