import * as schema from "./typescript.ts";

const chapters = [
	[
		{ tag: "h2", data: "The Creation" },
		"In the beginning God created the heavens and the earth.",
		{ tag: "p" },
		"Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.",
		{ tag: "h2", data: "The First Day" },
		"And God said, “Let there be light,” and there was light.",
		"And God saw that the light was good, and He separated the light from the darkness.",
		"God called the light “day,” and the darkness He called “night.” And there was evening, and there was morning—the first day.",
	],
	[
		{ tag: "h2", data: "The Seventh Day" },
		"Thus the heavens and the earth were completed in all their vast array.",
		"And by the seventh day God had finished the work He had been doing; so on that day He rested from all His work.",
		"Then God blessed the seventh day and sanctified it, because on that day He rested from all the work of creation that He had accomplished.",
	],
] as const;

const segmenter = new Intl.Segmenter("en", { granularity: "word" });
const isWordSeperator = (text: string) =>
	text.match(/[\p{Pc}\p{Pd}\p{Z}]+/u) != null;

const docId = 1;
let wordId = 1;
const lang = "eng";
const newWord = (): schema.Word => ({
	doc: docId,
	id: wordId++,
	lang,
	before: "",
	text: "",
	after: "",
});

function toBeforeAfter(input: string): schema.Word[] {
	const res: ReturnType<typeof toBeforeAfter> = [];
	let next = newWord();

	for (const s of segmenter.segment(input)) {
		if (isWordSeperator(s.segment)) {
			res.push(next);
			next = newWord();
			next.before = s.segment;
		} else if (s.isWordLike) {
			next.text += s.segment;
		} else if (next.text) {
			next.after += s.segment;
		} else {
			next.before += s.segment;
		}
	}
	if (next.text) {
		res.push(next);
	} else {
		const punctAsWord = next.before || next.after;
		if (punctAsWord) {
			const word = newWord();
			word.text = punctAsWord;
			res.push(word);
		}
	}

	return res;
}

const res = {
	document: { id: docId, book: "gen" },
	words: [] as schema.Word[],
	blocks: [] as schema.Block[],
} satisfies schema.All;

for (let c = 0; c < chapters.length; c++) {
	res.blocks.push({ doc: docId, word: wordId, tag: "c", depth: c + 1 });

	let v = 1;
	for (const obj of chapters[c]) {
		if (typeof obj === "string") {
			res.blocks.push({ doc: docId, word: wordId, tag: "v", depth: v++ });
			const newWords = toBeforeAfter(obj);
			res.words.push(...newWords);
		} else if (obj.tag === "h2") {
			res.blocks.push({ doc: docId, word: wordId, tag: "h2", depth: 1 });
			const newWords = toBeforeAfter(obj.data);
			res.words.push(...newWords);
		} else if (obj.tag === "p") {
			res.blocks.push({ doc: docId, word: wordId, tag: "p", depth: 1 });
		}
	}
}

export default res;
