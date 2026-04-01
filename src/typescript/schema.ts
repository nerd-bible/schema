import * as v from "@nerd-bible/valio";

const id = v.number();

// Publication or note.
export const doc = v.object({ id, lang: v.string() });
export type Doc = v.Output<typeof doc>;
export const publication = v
	.object({
		id,
		book: v.string(),
		code: v.string(),
	})
	.extendPartial({
		published: v.date(),
		url: v.string(),
	});
export type Publication = v.Output<typeof publication>;

// Document content
export const word = v
	.object({
		doc: id,
		id,
		text: v.string(),
	})
	.extendPartial({
		lang: v.string(),
	});
export type Word = v.Output<typeof word>;
export const grammar = v
	.object({
		doc: id,
		word: id,
	})
	.extendPartial({
		lemma: v.string(), // concordance
		upos: v.string(),
		xpos: v.string(),
		feats: v.record(v.string(), v.string()),
		misc: v.record(v.string(), v.string()),
	});
export type Grammar = v.Output<typeof grammar>;
export const source = v.object({
	doc: id,
	word: id,
	srcDoc: id,
	srcWord: id,
});
export type Source = v.Output<typeof source>;

// Document layout.
export const block = v
	.object({
		doc: id,
		word: id,
		depth: v.number(),
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
	})
	.extendPartial({
		attrs: v
			.object({
				class: v.string(),
				dir: v.enum(["ltr", "rtl"]),
				html: v.string(),
			})
			.partial(),
	});
export type Block = v.Output<typeof block>;
export const span = v.object({
	doc: id,
	startWord: v.number(),
	endWord: v.number(),
	value: v.union([
		v.object({ tag: v.literal("q"), cite: v.string() }),
		v.object({ tag: v.literal("em") }),
		v.object({ tag: v.literal("strong") }),
	]),
});
export type Span = v.Output<typeof span>;

// Annotations.
export const docTag = v
	.object({
		id,
		tag: v.string(),
	})
	.extendPartial({ value: v.any() });
export type DocTag = v.Output<typeof docTag>;
export const highlight = v
	.object({
		id,
		name: v.string(),
	})
	.extendPartial({
		backgroundColor: v.string(),
		textDecoration: v.string(),
	});
export type Highlight = v.Output<typeof highlight>;
export const anchor = v
	.object({
		id,
		doc: id,
		word: id,
		side: v.enum([0 /** left */, 1 /** right */]),
		tag: v.string(),
	})
	.extendPartial({
		data: v.any(),
		note: v.number(),
	});
export type Anchor = v.Output<typeof anchor>;

export const wordSearch = v.object({
	doc: id,
	word: id,
	wordEnd: id,

	plane: v.number(),
	pos: v.number(),
	stem: v.string(),
});
export type WordSearch = v.Output<typeof wordSearch>;
