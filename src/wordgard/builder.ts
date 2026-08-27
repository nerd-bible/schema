import { builtin64 } from "../util/rand.ts";
const defaultLoadFactor = 0.8;
const maxInt = BigInt("0x" + "F".repeat(16));

function pushText(text: string, lang = this.meta.lang) {
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

	function remapPositions(loadFactor: number = 0.8) {
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
