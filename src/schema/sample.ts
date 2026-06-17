import { Hasher } from "../hash.ts";
import type { Doc } from "./builder.ts";
import { Namespace } from "./builder.ts";
import type { Book } from "./tables.ts";

const hasher = new Hasher("SHA-256");
const lang = "eng";

type Heading = { tag: "h2" | "h3" | "h4" | "h5" | "h6"; text: string };
type Paragraph = { tag: "p" };
type Chapter = { tag: "c"; n: number };
type Verse = { tag: "v"; n: number };
type Note = { tag: "pn"; children: Inline[] };
type Span = { tag: "em" | "strong" | "q"; children: Inline[] };
type Inline = Span | string | Verse;
type Content = (Heading | Paragraph | Chapter | Verse | Note | Inline)[];

let chapter = 1;
let nextOutlineText: bigint | undefined;

async function parseTag(n: Namespace, d: Doc, tag: Content[number]) {
	if (typeof tag === "string") {
		d.pushText(tag);
		return;
	}

	switch (tag.tag) {
		case "h2": {
			const newDoc = n.createDoc({ lang });
			newDoc.pushText(tag.text);
			nextOutlineText = newDoc.meta.id;
			break;
		}
		case "p":
			d.pushBlock({ tag: "p" });
			break;
		case "c":
			chapter = tag.n;
			break;
		case "v":
			d.pushOutline({
				chapter,
				verse: tag.n,
				...(nextOutlineText ? { text: nextOutlineText } : {}),
			});
			nextOutlineText = undefined;
			break;
		case "em":
		case "strong":
		case "q":
			d.pushMark({ tag: tag.tag });
			for (const t of tag.children) await parseTag(n, d, t);
			d.endMark(tag.tag);
			break;
		case "pn": {
			hasher.reset();
			await hasher.any(tag.children);
			const note = n.createDoc({ ...d.meta, id: hasher.bigint63() });
			for (const t of tag.children) await parseTag(n, note, t);
			break;
		}
	}
}

async function sampleDocument(id: Book, content: Content) {
	const n = new Namespace({ name: "Berean Standard Bible", short: "BSB" });
	await hasher.any(content);
	const d = n.createDoc({
		lang,
		book: id,
		title: id === "gen" ? "Genesis" : "Exodus",
		createdAt: new Date("2025-12-23"),
		id: hasher.bigint63(),
	});
	for (const t of content) await parseTag(n, d, t);
	return n.finalize();
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
	" Then God blessed the seventh day and sanctified it, because on that day He rested from all the work of creation that He had accomplished. YAY",
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
	" “Look,” he said to his people, ",
	{
		tag: "q",
		children: [
			"“the Israelites have become too numerous and too powerful for us.",
			{ tag: "v", n: 10 },
			" Come, let us deal shrewdly with them, or they will increase even more; and if a war breaks out, they may join our enemies, fight against us, and leave the country.”",
		],
	},
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
