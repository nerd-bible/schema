// db
import { Database } from "@tursodatabase/database";
import { drizzle } from "drizzle-orm/tursodatabase/database";
import { plot, doc, changeSet } from "./schema.ts";
import { readFileSync } from "node:fs";
import type { InferInsertModel } from "drizzle-orm";
// wordgard
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import book from "../wordgard/book.ts";
import { GardState } from "wordgard/state";
import { Leaf, Plot } from "wordgard/doc";
import { VerseNum } from "../wordgard/verse.ts";
import { Hasher } from "../util/hash.ts";

async function initSchema() {
	const client = new Database("test.db", {
		experimental: ["custom_types", "index_method"],
	});
	await client.connect();
	const schema = readFileSync("./migrations/turso/1.sql", "utf8");
	await client.exec(schema);

	return drizzle({ client });
}

// I prefer HTML for test documents storage since it's easier to acquire and
// author than Wordgard JSON.
GlobalRegistrator.register({
	url: "http://localhost:3000",
	width: 1920,
	height: 1080,
});

const wg = GardState.create({
	doc: readFileSync("testdata/gen-bsb.html", "utf8"),
	config: [book],
});

const db = await initSchema();
const docId = (
	await db.insert(doc).values([{ lang: "eng", book: "gen", title: "BSB" }])
).lastInsertRowid;

db.select().from(doc).get;

// make an initial commit

// row per-plot
type Row = InferInsertModel<typeof plot>;
const rows: Row[] = [];

type Marks = { [name: string]: any };

type Content = ({ v: string } | { t: number }) & { marks?: Marks };

function textContent(node: Plot): string {
	let res = "";
	node.iterate((node) => {
		if (node.tag.is(VerseNum.type)) return false;
		if (node.isText) res += node.param as string;
	});
	return res;
}

function addMarks<T extends { marks?: Marks }>(node: Leaf | Plot, c: T): T {
	if (node.marks.length) {
		c.marks = {};
		for (let { name, value } of node.marks) c.marks![name] = value;
	}
	return c;
}

function makeContent(node: Plot): Content[] {
	let res: ReturnType<typeof makeContent> = [];

	node.iterate((c) => {
		if (c.tag.is(VerseNum.type)) {
			const text = (c as Plot).textContent();
			res.push(addMarks(c, { v: text } as Content));
			return false;
		} else if (c.isText) {
			res.push(addMarks(c, { t: c.length } as Content));
		}
	});

	return res;
}

function makeRow(node: Leaf | Plot, parent?: number, extra?: any): Row {
	return addMarks(node, {
		id: rows.length + 1,
		doc: docId,
		type: node.tag.name,
		param: node.tag.param,
		length: node.length,
		parent,
		...extra,
	});
}

function pushRows(node: Leaf | Plot, parent?: number) {
	if (node instanceof Plot) {
		if (node.inlineContent) {
			// base case
			rows.push(
				makeRow(node, parent, {
					text_content: textContent(node),
					content: makeContent(node),
				}),
			);
		} else {
			// recurse
			rows.push(makeRow(node, parent));
			const parentId = rows.length;
			for (const c of node.content) pushRows(c, parentId);
		}
	}
	return false;
}

wg.doc.iterate((node) => pushRows(node));
await db.insert(plot).values(rows);

const cs: Omit<InferInsertModel<typeof changeSet>, "id"> = {
	author: "BSB",
	doc: docId,
	message: "Initial commit",
	timestamp: new Date(),
};
const hasher = new Hasher("SHA-256");
await hasher.any(rows);
await hasher.any(cs);
const bytes = new Uint8Array(hasher.hash);
console.log(bytes.toHex());

await db.insert(changeSet).values({ id: bytes, ...cs });
await db.$client.close();
