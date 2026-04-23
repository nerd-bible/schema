import { builtin64 } from "../rand.ts";
import * as t from "./tables.ts";
import * as ref from "@nerd-bible/ref";

const isWordSeperator = (text: string) =>
	text.match(/[\p{Pc}\p{Pd}\p{Z}]+/u) != null;
const bcv = new RegExp(ref.bcvStrict.source, ref.bcv.flags + "g");

export type Token = {
	before: string;
	text: string;
	after: string;
};

type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };

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

function getOrInsert<K, V>(map: Map<K, V>, key: K, value: V): V {
	const maybe = map.get(key);
	if (maybe) return maybe;
	map.set(key, value);
	return value;
}

export class Builder {
	docs: t.Doc[] = [];
	docTags: t.DocTag[] = [];
	scriptures: t.Scripture[] = [];
	highlights: t.Highlight[] = [];
	notes: t.Note[] = [];
	outlines: t.Outline[] = [];
	xrefs: t.Xref[] = [];

	docWords: Map<bigint, t.Word[]> = new Map();
	docMarks: Map<bigint, t.Mark[]> = new Map();

	docIndex = 0;
	chapter = 1;
	verse = 0;

	get doc() {
		return this.docs[this.docIndex];
	}

	get scripture() {
		return this.scriptures[this.scriptures.length - 1];
	}

	get words() {
		return getOrInsert(this.docWords, this.doc.id, []);
	}

	get wordId() {
		return BigInt(this.words.length) * 3n + 3n;
	}

	get marks() {
		return getOrInsert(this.docMarks, this.doc.id, []);
	}

	pushDoc(doc: MakeOptional<t.Doc, "id">) {
		this.docs.push({
			id: doc.id ?? builtin64(),
			lang: doc.lang,
			title: doc.title,
			createdAt: doc.createdAt,
		});
		this.docIndex = this.docs.length - 1;
	}

	pushScripture(doc: MakeOptional<t.Doc, "id"> & Omit<t.Scripture, "doc">) {
		this.pushDoc(doc);
		this.scriptures.push({
			doc: this.doc.id,
			code: doc.code,
			book: doc.book,
			urls: doc.urls,
		});
	}

	pushOutline(
		outline: MakeOptional<t.Outline, "doc" | "scripture" | "chapter" | "verse">,
		chapter = this.chapter,
		verse = this.verse + 1
	) {
		this.outlines.push({
			doc: outline.doc ?? this.doc.id,
			scripture: outline.scripture ?? this.scripture.doc,
			chapter,
			verse,
			level: outline.level,
			text: outline.text,
		});
	}

	pushNote(
		note: MakeOptional<t.Doc, "id"> &
			MakeOptional<Omit<t.Note, "doc">, "ref" | "refStart">,
	) {
		this.pushDoc(note);
		this.notes.push({
			doc: this.doc.id,
			ref: this.doc.id,
			refStart: note.refStart ?? BigInt(this.words.length - 1),
			refEnd: note.refEnd,
			highlight: note.highlight,
		});
	}

	pushWord(text?: string, lang = this.doc.lang) {
		const words = this.words;
		words.push({
			doc: this.doc.id,
			id: this.wordId,
			lang: lang === this.doc.lang ? undefined : lang,
			text,
		});
	}

	pushText(text: string, lang = this.doc.lang) {
		const tokenizeSpan = (start: number, end: number) => {
			for (const t of tokenize(text.substring(start, end), this.doc.lang))
				this.pushWord(t.before + t.text + t.after, lang);
		};

		let i = 0;
		for (const m of text.matchAll(bcv)) {
			tokenizeSpan(i, m.index);
			this.startMark("ref", {
				book: ref.book.fromEnglish(m[1]),
				chapter: +m[2],
				verse: +m[3],
			});
			const end = m.index + m[0].length;
			this.pushWord(text.substring(m.index, end), "r");
			this.endMark("ref");
			i = end;
		}
		tokenizeSpan(i, text.length);
	}

	startMark(tag: t.Mark["tag"], data: t.Mark["data"] = {}) {
		const marks = this.marks;
		if (tag === "c") {
			this.chapter = data;
			this.verse = 0;
		}
		if (tag === "v") this.verse = data;
		marks.push({ doc: this.doc.id, start: this.wordId - 1n, tag, data });
	}

	endMark(tag: t.Mark["tag"]) {
		const marks = this.marks;
		const last = marks.findLast((s) => s.doc === this.doc.id && s.tag === tag);
		if (last) last.end = BigInt(this.wordId - 2n);
	}

	remapWordIds(loadFactor: number) {
		// Build map fns
		const docMapFns = new Map<bigint, (id: bigint) => bigint>();
		const approxMaxInt = Number(BigInt("0xFFFFFFFFFFFFFFFF"));
		const approxMin = Math.floor(-approxMaxInt * loadFactor);
		const min = (BigInt(approxMin) >> 2n) << 1n;
		for (const d of this.docs) {
			const words = this.docWords.get(d.id)!;
			const approxInc = Math.floor(-approxMin / (words.length * 3 - 1));
			const inc = BigInt(approxInc);
			docMapFns.set(d.id, (idx: bigint) => {
				let res = min + inc * (idx / 3n);
				switch (idx % 3n) {
					case 1n:
						return res + 1n;
					case 2n:
						return res + inc - 1n;
				}
				return res;
			});
		}

		// Use map fns
		for (const [id, words] of this.docWords.entries()) {
			const mapper = docMapFns.get(id)!;
			for (const w of words) w.id = mapper(w.id);
		}
		for (const [id, marks] of this.docMarks.entries()) {
			const mapper = docMapFns.get(id)!;
			for (const m of marks) {
				m.start = mapper(m.start);
				if (m.end) m.end = mapper(m.end);
			}
		}
		for (const n of this.notes) {
			const mapper = docMapFns.get(n.ref)!;
			n.refStart = mapper(n.refStart);
			if (n.refEnd) n.refEnd = mapper(n.refEnd);
		}
		for (const x of this.xrefs) {
			const srcMapper = docMapFns.get(x.src)!;
			x.srcStart = srcMapper(x.srcStart);
			if (x.srcEnd) x.srcEnd = srcMapper(x.srcEnd);
			const destMapper = docMapFns.get(x.dest)!;
			if (x.destStart) x.destStart = destMapper(x.destStart);
			if (x.destEnd) x.destEnd = destMapper(x.destEnd);
		}
	}

	finalize(loadFactor = 0.8): this {
		this.remapWordIds(loadFactor);
		return this;
	}
}
