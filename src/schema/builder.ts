import { builtin64 } from "../util/rand.ts";
import * as t from "./tables.ts";
import * as ref from "@nerd-bible/ref";

const isWordSeperator = (text: string) =>
	text.match(/[\p{Pc}\p{Pd}\p{Z}]+/u) != null;
const bcv = new RegExp(ref.bcvStrict.source, ref.bcv.flags + "g");
const wordGap = 2; // for cursors
const defaultLoadFactor = 0.8;
const maxInt = BigInt("0x" + "F".repeat(16));

type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };
export type Token = {
	before: string;
	text: string;
	after: string;
};

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

export class Doc {
	meta: t.Doc;
	tags: t.DocTag[] = [];
	words: t.Word[] = [];
	blocks: t.Block[] = [];
	outlines: t.Outline[] = [];
	marks: t.Mark[] = [];

	constructor(meta: MakeOptional<t.Doc, "id">) {
		meta.id ??= builtin64();
		this.meta = meta as t.Doc;
	}

	pushTag(tag: MakeOptional<t.DocTag, "doc">) {
		tag.doc ??= this.meta.id;
		this.tags.push(tag as t.DocTag);
	}

	get wordId() {
		return BigInt(this.words.length + 1) * BigInt(wordGap);
	}

	pushWord(text: string, lang = this.meta.lang): bigint {
		const id = this.wordId;
		if (lang != this.meta.lang) this.pushMark({ tag: "lang", data: lang });
		this.words.push({ doc: this.meta.id, pos: id, text });
		return id;
	}

	pushBlock(
		block: MakeOptional<t.Block, "namespace" | "doc" | "id" | "pos">,
	): bigint {
		block.namespace ??= this.meta.namespace;
		block.doc ??= this.meta.id;
		block.id ??= builtin64();
		block.pos ??= this.wordId - 1n;
		this.blocks.push(block as t.Block);

		return block.id;
	}

	pushOutline(
		outline: MakeOptional<t.Outline, "namespace" | "doc" | "id" | "pos">,
	): bigint {
		outline.namespace ??= this.meta.namespace;
		outline.doc ??= this.meta.id;
		outline.id ??= builtin64();
		outline.pos ??= this.wordId - 1n;
		this.outlines.push(outline as t.Outline);

		return outline.id;
	}

	pushMark(mark: MakeOptional<t.Mark, "namespace" | "doc" | "start">) {
		mark.namespace ??= this.meta.namespace;
		mark.doc ??= this.meta.id;
		mark.start ??= this.wordId;
		this.marks.push(mark as t.Mark);
	}

	endMark(tag?: t.Mark["tag"]) {
		const marks = this.marks;
		const last = marks.findLast((s) => (tag ? s.tag === tag : true));
		if (last) last.end = this.wordId - BigInt(wordGap);
	}

	pushText(text: string, lang = this.meta.lang) {
		const tokenizeSpan = (start: number, end: number) => {
			for (const t of tokenize(text.substring(start, end), this.meta.lang))
				this.pushWord(t.before + t.text + t.after, lang);
		};

		let i = 0;
		for (const m of text.matchAll(bcv)) {
			tokenizeSpan(i, m.index);
			this.pushMark({
				tag: "ref",
				data: {
					book: ref.book.fromEnglish(m[1]),
					chapter: +m[2],
					verse: +m[3],
				},
			});
			const end = m.index + m[0].length;
			this.pushWord(text.substring(m.index, end), lang);
			i = end;
		}
		tokenizeSpan(i, text.length);
	}

	remapPositions(loadFactor: number) {
		const min = (-maxInt * BigInt(loadFactor * 1e9)) / BigInt(1e9) / 2n;
		const inc = -min / BigInt(this.words.length + 1);

		function mapper(idx: bigint) {
			return min + inc * idx;
		}

		for (const w of this.words) w.pos = mapper(w.pos);
		for (const m of this.marks) {
			m.start = mapper(m.start);
			if (m.end) m.end = mapper(m.end);
		}
		for (const b of this.blocks) b.pos = mapper(b.pos);
		for (const o of this.outlines) o.pos = mapper(o.pos);
	}

	finalize(loadFactor = defaultLoadFactor): this {
		this.remapPositions(loadFactor);
		return this;
	}
}

export class Namespace {
	namespace: t.Namespace;
	docs: Doc[] = [];

	constructor(namespace: MakeOptional<t.Namespace, "id">) {
		namespace.id ??= builtin64();
		this.namespace = namespace as t.Namespace;
	}

	createDoc(meta: MakeOptional<t.Doc, "namespace" | "id">): Doc {
		meta.namespace ??= this.namespace.id;
		const res = new Doc(meta as t.Doc);
		this.docs.push(res);
		return res;
	}

	finalize(loadFactor = defaultLoadFactor): this {
		for (const d of this.docs.values()) d.finalize(loadFactor);
		return this;
	}
}
