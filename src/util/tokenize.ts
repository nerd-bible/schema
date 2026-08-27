export type Token = {
	before: string;
	text: string;
	after: string;
};

const isWordSeperator = (text: string) =>
	text.match(/[\p{Pc}\p{Pd}\p{Z}]+/u) != null;

// Groups punctuation splits with words.
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
