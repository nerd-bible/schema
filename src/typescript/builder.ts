import { builtin63 } from "../rand.ts";
import * as t from "./tablesVersioned.ts";

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
		if (next.before && !next.after && words.length)
			words[words.length - 1].after = next.before;
		else if (punctAsWord)
			words.push({ before: "", text: punctAsWord, after: "" });
	}

	return words;
}

export class Builder {
	doc: t.Doc;
	publication?: Omit<t.Publication, "doc">;

	words: t.Word[] = [];
	grammars: t.Grammar[] = [];

	marks: (t.Mark & {
		startSide?: "before" | "after";
		endSide?: "before" | "after";
	})[] = [];

	constructor(
		lang: string,
		id = builtin63(),
		publication?: Omit<t.Publication, "doc">,
	) {
		this.doc = { id, lang };
		this.publication = publication;
	}

	pushWord(text?: string, lang = this.doc.lang) {
		const id = BigInt(this.words.length);

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
		grammar: (t: Token) => Omit<t.Grammar, "doc" | "word"> | undefined = noop,
	) {
		for (const t of tokenize(text, this.doc.lang)) {
			const id = this.pushWord(t.before + t.text + t.after, lang);
			const g = grammar(t);
			if (g) this.grammars.push({ doc: this.doc.id, word: id, ...g });
		}
	}

	startMark(tag: t.Mark["tag"], data: t.Mark["data"] = {}) {
		this.marks.push({
			doc: this.doc.id,
			start: BigInt(this.words.length),
			startSide: "before",
			end: BigInt(this.words.length),
			endSide: "after",
			tag,
			data,
		});
	}

	endMark(tag: string) {
		const last = this.marks.findLast((s) => s.tag === tag);
		if (last) last.end = BigInt(this.words.length - 1);
	}

	remapWordIds(loadFactor: number) {
		const approxMaxInt = Number(BigInt("0xFFFFFFFFFFFFFFFF"));
		const approxMin = Math.floor(approxMaxInt * -loadFactor);
		const approxInc = Math.floor((approxMin / -this.words.length) * 2);
		const inc = BigInt(approxInc);
		const min = BigInt(approxMin);

		const map = (id: bigint) => min + inc * id;

		for (const w of this.words) w.id = map(w.id);
		for (const w of this.grammars) w.word = map(w.word);
		for (const s of this.marks) {
			s.start = map(s.start);
			s.start += s.startSide === "before" ? 1n : -1n;
			if (s.end) {
				s.end = map(s.end);
				s.end += s.endSide === "before" ? 1n : -1n;
			}

			delete s.startSide;
			delete s.endSide;
		}
	}

	finalize(loadFactor = 0.8): this {
		this.remapWordIds(loadFactor);
		return this;
	}
}

// Doc and subdocuments
export class MultiBuilder {
	builders: Builder[] = [];
	active: Builder;

	constructor(
		lang: string,
		id = builtin63(),
		publication?: Omit<t.Publication, "doc">,
	) {
		this.active = new Builder(lang, id, publication);
		this.builders.push(this.active);
	}

	fork(newPublication?: Builder["publication"], newId = builtin63()) {
		const og = this.builders[0];
		this.active = new Builder(og.doc.lang, newId, newPublication);
		this.builders.push(this.active);
	}

	pushWord(text?: string, lang = this.active.doc.lang) {
		return this.active.pushWord(text, lang);
	}

	pushText(
		text: string,
		lang = this.active.doc.lang,
		grammar: (t: Token) => Omit<t.Grammar, "doc" | "word"> | undefined = noop,
	) {
		return this.active.pushText(text, lang, grammar);
	}

	startMark(tag: t.Mark["tag"], data: t.Mark["data"] = {}) {
		return this.active.startMark(tag, data);
	}

	endMark(tag: string) {
		return this.active.endMark(tag);
	}

	remapIds(loadFactor: number) {
		for (const b of this.builders) b.remapWordIds(loadFactor);
	}

	finalize(loadFactor = 0.8): this {
		this.remapIds(loadFactor);
		return this;
	}
}
