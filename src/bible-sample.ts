import * as schema from "./typescript.ts";

type Chapter = ({ tag: "h2"; data: string } | { tag: "p" } | string)[];

const segmenter = new Intl.Segmenter("en", { granularity: "word" });
const isWordSeperator = (text: string) =>
	text.match(/[\p{Pc}\p{Pd}\p{Z}]+/u) != null;

let docId = 1;
const lang = "eng";

function sampleDocument(book: string, chapters: Chapter[]) {
	const doc = {
		document: { id: docId, lang, book },
		words: [] as schema.Word[],
		blocks: [] as schema.Block[],
	} satisfies schema.All;
	let wordId = 1;
	const newWord = (text = ""): schema.Word => ({
		doc: docId,
		id: wordId++,
		lang,
		before: "",
		text,
		after: "",
	});

	function toBeforeAfter(input: string): schema.Word[] {
		const words: ReturnType<typeof toBeforeAfter> = [];
		let next = newWord();

		for (const s of segmenter.segment(input)) {
			if (isWordSeperator(s.segment)) {
				if (next.text) {
					words.push(next);
					next = newWord();
				}
				next.before += s.segment;
			} else if (s.isWordLike) {
				next.text += s.segment;
			} else if (next.text) {
				next.after += s.segment;
			} else {
				next.before += s.segment;
			}
		}
		// flush
		if (next.text) words.push(next);
		else {
			const punctAsWord = next.before || next.after;
			if (punctAsWord) words.push(newWord(punctAsWord));
		}

		return words;
	}

	for (let c = 0; c < chapters.length; c++) {
		doc.blocks.push({ doc: docId, word: wordId, tag: "c", depth: c + 1 });

		let v = 1;
		for (const obj of chapters[c]) {
			if (typeof obj === "string") {
				doc.blocks.push({ doc: docId, word: wordId, tag: "v", depth: v++ });
				const newWords = toBeforeAfter(obj);
				doc.words.push(...newWords);
			} else if (obj.tag === "h2") {
				doc.blocks.push({ doc: docId, word: wordId, tag: "h2", depth: 1 });
				const newWords = toBeforeAfter(obj.data);
				doc.words.push(...newWords);
			} else if (obj.tag === "p") {
				doc.blocks.push({ doc: docId, word: wordId, tag: "p", depth: 1 });
			}
		}
	}

	docId++;
	return doc;
}

export const gen = sampleDocument("gen", [
	[
		{ tag: "h2", data: "The Creation" },
		{ tag: "p" },
		"In the beginning God created the heavens and the earth.",
		{ tag: "p" },
		"Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.",
		{ tag: "h2", data: "The First Day" },
		{ tag: "p" },
		"And God said, “Let there be light,” and there was light.",
		" And God saw that the light was good, and He separated the light from the darkness.",
		" God called the light “day,” and the darkness He called “night.” And there was evening, and there was morning — the first day.",
	],
	[
		{ tag: "h2", data: "The Seventh Day" },
		{ tag: "p" },
		"Thus the heavens and the earth were completed in all their vast array.",
		" And by the seventh day God had finished the work He had been doing; so on that day He rested from all His work.",
		" Then God blessed the seventh day and sanctified it, because on that day He rested from all the work of creation that He had accomplished.",
	],
]);
export const exo = sampleDocument("exo", [
	[
		{ tag: "h2", data: "The Israelites Multiply in Egypt" },
		{ tag: "p" },
		"These are the names of the sons of Israel who went to Egypt with Jacob, each with his family:",
		{ tag: "p" },
		"Reuben, Simeon, Levi, and Judah;",
		" Issachar, Zebulun, and Benjamin;",
		" Dan and Naphtali; Gad and Asher.",
		{ tag: "p" },
		"The descendants of Jacob numbered seventya in all, including Joseph, who was already in Egypt.",
		" Now Joseph and all his brothers and all that generation died,",
		" but the Israelites were fruitful and increased rapidly; they multiplied and became exceedingly numerous, so that the land was filled with them.",
		{ tag: "h2", data: "Oppression by a New King" },
		{ tag: "p" },
		"Then a new king, who did not know Joseph, came to power in Egypt.",
		" “Look,” he said to his people, “the Israelites have become too numerous and too powerful for us.",
		" Come, let us deal shrewdly with them, or they will increase even more; and if a war breaks out, they may join our enemies, fight against us, and leave the country.”",
	],
	[
		{ tag: "h2", data: "The Birth and Adoption of Moses" },
		{ tag: "p" },
		"Now a man of the house of Levi married a Levite woman,",
		" and she conceived and gave birth to a son. When she saw that he was a beautiful child, she hid him for three months.",
	],
]);
