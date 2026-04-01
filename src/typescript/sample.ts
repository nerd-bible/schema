import { Builder } from "./builder.ts";

type Chapter = ({ tag: "h2"; data: string } | { tag: "p" } | string)[];

let docId = 1;

function sampleDocument(book: string, chapters: Chapter[]) {
	const doc = new Builder(docId++, "eng", { book, code: "BSB" });

	for (let c = 0; c < chapters.length; c++) {
		doc.pushBlock("c", c + 1);

		let v = 1;
		for (const obj of chapters[c]) {
			if (typeof obj === "string") {
				doc.pushBlock("v", v++);
				doc.pushText(obj);
			} else if (obj.tag === "h2") {
				doc.pushBlock("h2", 1, { html: obj.data });
			} else if (obj.tag === "p") {
				doc.pushBlock("p", 1);
			}
		}
	}

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
