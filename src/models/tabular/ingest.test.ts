import { Database } from "@tursodatabase/database";
import { drizzle } from "drizzle-orm/tursodatabase/database";
import * as schema from "./schema.ts";
import { readFileSync } from "node:fs";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import book from "../wordgard/book.ts";
import { GardState } from "wordgard/state";
import { toCanonical } from "./convert.ts";
import type { InferInsertModel } from "drizzle-orm";
import { tsid64 } from "../../util/rand.ts";
import { Hasher } from "../../util/hash.ts";

async function initSchema() {
	const client = new Database("test.db", {
		experimental: ["custom_types", "index_method"],
	});
	await client.connect();
	const schema = readFileSync("./migrations/turso/1.sql", "utf8");
	await client.exec(schema);

	return drizzle({ client });
}

const db = await initSchema();

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
const doc: InferInsertModel<typeof schema.doc> = {
	id: tsid64(),
	lang: "eng",
	book: "gen",
	title: "Genesis",
	version: null, // will fill in later
};

const plots = await toCanonical(wg.doc, doc.id);

const cs: Omit<InferInsertModel<typeof schema.changeSet>, "id"> = {
	author: "BSB",
	doc: doc.id,
	message: "Initial commit",
	timestamp: new Date(),
	parents: [],
};
const hasher = new Hasher("SHA-256");
await hasher.any(plots);
await hasher.any(cs);
doc.version = new Uint8Array(hasher.hash);
console.log({ ...doc, version: doc.version.toHex() });

console.time("transact");
await db.transaction(async (tx) => {
	await tx.insert(schema.doc).values(doc);
	await tx.insert(schema.plot).values(plots);
	await tx.insert(schema.changeSet).values({ id: doc.version!, ...cs });
});
console.timeEnd("transact");
