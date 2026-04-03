import { builtin32 } from "../rand.ts";
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

type Side = "left" | "right" | 0 | 1;
function sideToInt(side: Side) {
	if (side === "left") return 0;
	if (side === "right") return 1;
	return side;
}

export class Builder {
	doc: s.Doc;
	publication?: Omit<s.Publication, "id">;

	words: s.Word[] = [];
	grammars: s.Grammar[] = [];
	sources: s.Source[] = [];

	spans: s.Span[] = [];

	constructor(
		lang: string,
		// TODO: 52 or 64 instead of 32 (likely need bigint)
		id: number = builtin32(),
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

	pushSource(srcDoc: number, srcWord: number) {
		this.sources.push({
			doc: this.doc.id,
			word: this.words.length,
			srcDoc,
			srcWord,
		});
	}

	startSpan(
		tag: s.Span["tag"],
		attrs: s.Span["attrs"] = {},
		startSide: Side = "left",
		endSide: Side = "right",
	) {
		this.spans.push({
			doc: this.doc.id,
			start: this.words.length,
			startSide: sideToInt(startSide),
			end: this.words.length,
			endSide: sideToInt(endSide),
			tag,
			attrs,
		});
	}

	endSpan(tag: string, endSide?: Side) {
		const last = this.spans.findLast((s) => s.tag === tag);
		if (last) {
			last.end = this.words.length - 1;
			if (endSide) last.endSide = sideToInt(endSide);
		}
	}

	remapIds(useSpace: number) {
		// TODO: small bigint library to get full 64 bit range instead of 52
		const min = -Number.MAX_SAFE_INTEGER * useSpace;
		const inc = Math.floor(-min / this.words.length) * 2;

		const map = (id: number) => min + inc * id;

		for (const w of this.words) w.id = map(w.id);
		for (const w of this.grammars) w.word = map(w.word);
		for (const w of this.sources) w.word = map(w.word);
		for (const s of this.spans) {
			s.start = map(s.start);
			s.end = map(s.end);
		}
	}

	finalize(useSpace = 0.8): this {
		this.remapIds(useSpace);
		return this;
	}
}
