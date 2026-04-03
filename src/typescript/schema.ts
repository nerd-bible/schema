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
const wordId = v.object({ doc: id, id });
export const voidTag = v.union([wordId.extend({ lang: v.literal("hr") })]);
export const word = v.union([
	voidTag,
	wordId.extend({ text: v.string() }).extendPartial({ lang: v.string() }),
]);
export type Word = v.Output<typeof word>;
export const grammar = v.object({ doc: id, word: id }).extendPartial({
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

// Formatting and notes.
const spanTags = [
	"p", // paragraph
	"c", // chapter
	"v", // verse
	"h1", // heading
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"h7",
	"h8",
	"ol", // ordered list
	"ul", // unordered list
	"li", // list item
	"q", // quote
	"em", // emphasis (italic)
	"strong", // strong (bold)
	"pn", // publisher note
	"un", // user note
] as const;
const side = v.enum([0, 1]);
export const span = v
	.object({
		doc: id,
		start: id,
		startSide: side,
		end: id, // inclusive
		endSide: side,
		tag: v.enum(spanTags),
	})
	.extendPartial({
		attrs: v.object({}).loose<string | number>(),
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

export const wordSearch = v.object({
	doc: id,
	word: id,
	wordEnd: id,

	plane: v.number(),
	pos: v.number(),
	stem: v.string(),
});
export type WordSearch = v.Output<typeof wordSearch>;
