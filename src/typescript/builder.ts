import { builtin64 } from "../rand.ts";
import * as s from "./schema.ts";

const isWordSeperator = (text: string) =>
	text.match(/[\p{Pc}\p{Pd}\p{Z}]+/u) != null;
const noop = () => undefined;

export type Token = {
	before: string;
	text: string;
	after: string;
};

// TODO: some language normalization (contractions, numbers, abbreviations, spelling)
// https://github.com/shelfio/text-normalizer/blob/master/src/english-mapping.ts
export function tokenize(input: string, lang: string): Token[] {
	const words: ReturnType<typeof tokenize> = [];
	let next = { before: "", text: "", after: "" };
	const segmenter = new Intl.Segmenter(lang, { granularity: "word" });

	for (const s of segmenter.segment(input)) {
		const isSep = isWordSeperator(s.segment);
		// flush
		if ((isSep || s.isWordLike) && next.text) {
			words.push(next);
			next = { before: "", text: "", after: "" };
		}
		if (isSep) next.before += s.segment;
		else if (s.isWordLike) next.text += s.segment;
		else if (next.text) next.after += s.segment;
		else next.before += s.segment;
	}
	// flush
	if (next.text) words.push(next);
	else {
		const punctAsWord = next.before || next.after;
		if (punctAsWord) words.push({ before: "", text: punctAsWord, after: "" });
	}

	return words;
}

export class Builder {
	doc: s.Doc;
	publication?: Omit<s.Publication, "id">;

	words: s.Word[] = [];
	grammars: s.Grammar[] = [];
	sources: s.Source[] = [];

	blocks: s.Block[] = [];
	spans: s.Span[] = [];

	anchors: s.Anchor[] = [];

	constructor(
		id: number = builtin64(),
		lang: string,
		publication?: Omit<s.Publication, "id">,
	) {
		this.doc = { id, lang };
		this.publication = publication;
	}

	pushWord(text: string, lang = this.doc.lang): number {
		const id = this.words.length;

		this.words.push({
			doc: this.doc.id,
			id,
			lang: lang === this.doc.lang ? undefined : lang,
			text,
		});

		return id;
	}

	pushText(
		text: string,
		lang = this.doc.lang,
		grammar: (t: Token) => Omit<s.Grammar, "doc" | "word"> | undefined = noop,
		source: (t: Token) => Omit<s.Source, "doc" | "word"> | undefined = noop,
	) {
		for (const t of tokenize(text, this.doc.lang)) {
			const id = this.pushWord(t.before + t.text + t.after, lang);
			const g = grammar(t);
			if (g) this.grammars.push({ doc: this.doc.id, word: id, ...g });
			const s = source(t);
			if (s) this.sources.push({ doc: this.doc.id, word: id, ...s });
		}
	}

	pushBlock(tag: s.Block["tag"], depth: number = 1, attrs?: s.Block["attrs"]) {
		this.blocks.push({
			doc: this.doc.id,
			word: this.words.length,
			tag,
			depth,
			attrs,
		});
	}

	pushSource(srcDoc: number, srcWord: number) {
		this.sources.push({
			doc: this.doc.id,
			word: this.words.length,
			srcDoc,
			srcWord,
		});
	}

	startSpan(value: s.Span["value"]) {
		this.spans.push({
			doc: this.doc.id,
			startWord: this.words.length,
			endWord: -1,
			value: value,
		});
	}

	endSpan(tag: string) {
		// TODO: some automatic tag closing logic like HTML parsers
		const last = this.spans.findLast((s) => s.value.tag === tag && !s.endWord);
		if (last) last.endWord = this.words.length;
	}

	addAnchor(
		side: "left" | "right" | 0 | 1,
		tag: string,
		note: number,
		data?: any,
	) {
		let sideParsed: 0 | 1 = 1;
		if (side === "right") sideParsed = 0;
		else if (side === "left") sideParsed = 1;
		else sideParsed = side;

		this.anchors.push({
			id: builtin64(),
			doc: this.doc.id,
			word: this.words.length,
			side: sideParsed,
			tag,
			note,
			data,
		});
	}

	mergeAdjacentSpans() {
		const last: Record<string, s.Span> = {};

		this.spans = this.spans.filter(s => {
			const key = JSON.stringify(s.value); 
			const prev = last[key];
			if (prev && prev.endWord + 1 === s.startWord) {
				prev.endWord = s.endWord;
				return false;
			}
			last[key] = s;
			return true;
		});
	}

	remapIds(useSpace: number) {
		const min = -Number.MAX_VALUE * useSpace;
		const inc = (-min / this.words.length) * 2;

		for (const w of this.words) w.id = min + inc * w.id;
		for (const prop of ["grammars", "sources", "blocks", "anchors"] as const) {
			for (const g of this[prop]) g.word = min + inc * g.word;
		}
		for (const s of this.spans) {
			s.startWord = min + inc * s.startWord;
			s.endWord = min + inc * s.endWord;
		}
	}

	finalize(useSpace = 0.8) {
		this.mergeAdjacentSpans();
		this.remapIds(useSpace);
	}
}
