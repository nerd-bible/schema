import { Hasher } from "../hash.ts";
import { Builder } from "./builder.ts";
import type { Book } from "./tables.ts";

const hasher = new Hasher("SHA-256");

type Heading = { tag: "h2"; text: string };
type Paragraph = { tag: "p" };
type Chapter = { tag: "c"; n: number };
type Verse = { tag: "v"; n: number };
type Note = { tag: "pn"; children: Inline[] };
type Span = { tag: "em" | "strong" | "q"; children: Inline[] };
type Inline = Span | string;
type Content = (Heading | Paragraph | Chapter | Verse | Note | Inline)[];

async function parseTag(b: Builder, tag: Content[number]) {
	if (typeof tag === "string") {
		b.pushText(tag);
		return;
	}

	switch (tag.tag) {
		case "h2": {
			b.pushOutline({ level: 1, text: tag.text });
			break;
		}
		case "p":
			b.startMark("p");
			break;
		case "c":
			b.startMark("c", tag.n);
			break;
		case "v":
			b.startMark("v", tag.n);
			break;
		case "em":
		case "strong":
		case "q":
			b.startMark(tag.tag);
			for (const t of tag.children) await parseTag(b, t);
			b.endMark(tag.tag);
			break;
		case "pn": {
			hasher.reset();
			await hasher.any(tag.children);
			b.pushNote({ id: hasher.bigint63(), lang: "eng" });
			for (const t of tag.children) await parseTag(b, t);
			b.docIndex = 0;
			break;
		}
	}
}

async function sampleDocument(id: Book, content: Content) {
	const b = new Builder();
	await hasher.any(content);
	b.pushScripture({
		id: hasher.bigint63(),
		lang: "eng",
		book: id,
		code: "BSB",
		title: id === "gen" ? "Genesis" : "Exodus",
		published: new Date("2025-12-23"),
	});
	for (const t of content) await parseTag(b, t);
	return b.finalize();
}

// TODO: usfm
export const gen = await sampleDocument("gen", [
	{ tag: "c", n: 1 },
	{ tag: "h2", text: "The Creation" },
	{ tag: "p" },
	{ tag: "v", n: 1 },
	"In the beginning God created the heavens and the earth.",
	{ tag: "p" },
	{ tag: "v", n: 2 },
	" Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.",
	{ tag: "h2", text: "The First Day" },
	{ tag: "p" },
	{ tag: "v", n: 3 },
	" And God said, “Let there be light,”",
	{ tag: "pn", children: ["Cited in 2 Corinthians 4:6"] },
	" and there was light.",
	{ tag: "v", n: 4 },
	" And God saw that the light was good, and He separated the light from the darkness.",
	{ tag: "v", n: 5 },
	" God called the light “day,” and the darkness He called “night.” And there was evening, and there was morning — the first day.",
	{
		tag: "pn",
		children: ["Literally ", { tag: "em", children: ["day one"] }],
	},
	{ tag: "c", n: 2 },
	{ tag: "h2", text: "The Seventh Day" },
	{ tag: "p" },
	{ tag: "v", n: 1 },
	" Thus the heavens and the earth were completed in all their vast array.",
	{ tag: "v", n: 2 },
	" And by the seventh day God had finished the work He had been doing; so on that day He rested from all His work.",
	{ tag: "pn", children: ["Cited in Hebrews 4:4"] },
	{ tag: "v", n: 3 },
	" Then God blessed the seventh day and sanctified it, because on that day He rested from all the work of creation that He had accomplished.",
]);
export const exo = await sampleDocument("exo", [
	{ tag: "c", n: 1 },
	{ tag: "h2", text: "The Israelites Multiply in Egypt" },
	{ tag: "p" },
	{ tag: "v", n: 1 },
	"These are the names of the sons of Israel who went to Egypt with Jacob, each with his family:",
	{ tag: "p" },
	{ tag: "v", n: 2 },
	" Reuben, Simeon, Levi, and Judah;",
	{ tag: "v", n: 3 },
	" Issachar, Zebulun, and Benjamin;",
	{ tag: "v", n: 4 },
	" Dan and Naphtali; Gad and Asher.",
	{ tag: "p" },
	{ tag: "v", n: 5 },
	" The descendants of Jacob numbered seventy",
	{
		tag: "pn",
		children: [
			"MT (see also Genesis 46:27); DSS and LXX (see also Acts 7:14) seventy-five",
		],
	},
	" in all, including Joseph, who was already in Egypt.",
	{ tag: "v", n: 6 },
	" Now Joseph and all his brothers and all that generation died,",
	{ tag: "v", n: 7 },
	" but the Israelites were fruitful and increased rapidly; they multiplied and became exceedingly numerous, so that the land was filled with them.",
	{ tag: "h2", text: "Oppression by a New King" },
	{ tag: "p" },
	{ tag: "v", n: 8 },
	" Then a new king, who did not know Joseph, came to power in Egypt.",
	{ tag: "v", n: 9 },
	" “Look,” he said to his people, “the Israelites have become too numerous and too powerful for us.",
	{ tag: "v", n: 10 },
	" Come, let us deal shrewdly with them, or they will increase even more; and if a war breaks out, they may join our enemies, fight against us, and leave the country.”",
	{
		tag: "pn",
		children: ["Or ", { tag: "em", children: ["and take the country"] }],
	},
	{ tag: "c", n: 2 },
	{ tag: "h2", text: "The Birth and Adoption of Moses" },
	{ tag: "p" },
	{ tag: "v", n: 1 },
	" Now a man of the house of Levi married a Levite woman,",
	{ tag: "v", n: 2 },
	" and she conceived and gave birth to a son. When she saw that he was a beautiful child, she hid him for three months.",
]);
