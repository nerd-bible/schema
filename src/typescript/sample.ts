import { Builder } from "./builder.ts";
import type { Span as SSpan } from "./schema.ts";

type Heading = { tag: "h2" };
type Paragraph = { tag: "p" };
type Chapter = { tag: "c" };
type Verse = { tag: "v" };
type Note = { tag: "pn"; children: Inline[] };
type Span = Pick<SSpan, "tag" | "attrs"> & { children: Inline[] };
type Inline = Span | string;
type Book = (Heading | Paragraph | Chapter | Verse | Note | Inline)[];

let c = 1;
let v = 1;
function parseTag(doc: Builder, tag: Book[number]) {
	if (typeof tag === "string") {
		doc.pushText(tag);
		return;
	}
	switch (tag.tag) {
		case "h2":
			doc.endSpan("h2");
			doc.startSpan("h2");
			break;
		case "p":
			doc.endSpan("p");
			doc.startSpan("p");
			break;
		case "c":
			doc.endSpan("c");
			doc.startSpan("c", { number: c++ });
			break;
		case "v":
			doc.endSpan("v");
			doc.startSpan("v", { number: v++ });
			break;
		case "em":
		case "strong":
		case "q":
		case "pn":
			doc.startSpan(tag.tag);
			for (const t of tag.children) parseTag(doc, t);
			doc.endSpan(tag.tag);
			break;
	}
}

function sampleDocument(id: string, content: Book) {
	const doc = new Builder("eng", undefined, { book: id, code: "BSB" });
	for (const t of content) parseTag(doc, t);
	doc.endSpan("v");
	doc.endSpan("c");
	doc.finalize();
	return doc;
}

// TODO: usfm
export const gen = sampleDocument("gen", [
	{ tag: "c" },
	{ tag: "h2" },
	"The Creation",
	{ tag: "p" },
	{ tag: "v" },
	"In the beginning God created the heavens and the earth.",
	{ tag: "p" },
	{ tag: "v" },
	" Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.",
	{ tag: "h2" },
	"The First Day",
	{ tag: "p" },
	{ tag: "v" },
	"And God said, “Let there be light,”",
	{ tag: "pn", children: ["Cited in 2 Corinthians 4:6"] },
	" and there was light.",
	{ tag: "v" },
	" And God saw that the light was good, and He separated the light from the darkness.",
	{ tag: "v" },
	" God called the light “day,” and the darkness He called “night.” And there was evening, and there was morning — the first day.",
	{
		tag: "pn",
		children: [
			"Literally ",
			{
				tag: "em",
				children: ["day one"],
			},
		],
	},
	{ tag: "c" },
	{ tag: "h2" },
	"The Seventh Day",
	{ tag: "p" },
	{ tag: "v" },
	"Thus the heavens and the earth were completed in all their vast array.",
	{ tag: "v" },
	" And by the seventh day God had finished the work He had been doing; so on that day He rested from all His work.",
	{ tag: "pn", children: ["Cited in Hebrews 4:4"] },
	{ tag: "v" },
	" Then God blessed the seventh day and sanctified it, because on that day He rested from all the work of creation that He had accomplished.",
]);
export const exo = sampleDocument("exo", [
	{ tag: "c" },
	{ tag: "h2" },
	"The Israelites Multiply in Egypt",
	{ tag: "p" },
	{ tag: "v" },
	"These are the names of the sons of Israel who went to Egypt with Jacob, each with his family:",
	{ tag: "p" },
	{ tag: "v" },
	"Reuben, Simeon, Levi, and Judah;",
	{ tag: "v" },
	" Issachar, Zebulun, and Benjamin;",
	{ tag: "v" },
	" Dan and Naphtali; Gad and Asher.",
	{ tag: "p" },
	{ tag: "v" },
	"The descendants of Jacob numbered seventy",
	{
		tag: "pn",
		children: [
			"MT (see also Genesis 46:27); DSS and LXX (see also Acts 7:14) seventy-five",
		],
	},
	" in all, including Joseph, who was already in Egypt.",
	{ tag: "v" },
	" Now Joseph and all his brothers and all that generation died,",
	{ tag: "v" },
	" but the Israelites were fruitful and increased rapidly; they multiplied and became exceedingly numerous, so that the land was filled with them.",
	{ tag: "h2" },
	"Oppression by a New King",
	{ tag: "p" },
	{ tag: "v" },
	"Then a new king, who did not know Joseph, came to power in Egypt.",
	{ tag: "v" },
	" “Look,” he said to his people, “the Israelites have become too numerous and too powerful for us.",
	{ tag: "v" },
	" Come, let us deal shrewdly with them, or they will increase even more; and if a war breaks out, they may join our enemies, fight against us, and leave the country.”",
	{ tag: "pn", children: ["Or and take the country"] },
	{ tag: "c" },
	{ tag: "h2" },
	"The Birth and Adoption of Moses",
	{ tag: "p" },
	{ tag: "v" },
	"Now a man of the house of Levi married a Levite woman,",
	{ tag: "v" },
	" and she conceived and gave birth to a son. When she saw that he was a beautiful child, she hid him for three months.",
]);
