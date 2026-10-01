// db
import { Database } from "@tursodatabase/database";
import { drizzle } from "drizzle-orm/tursodatabase/database";
import { plot, doc, changeSet } from "./schema.ts";
import { readFileSync } from "node:fs";
import * as migrations from "./index.ts";
// wordgard
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import book from "../wordgard/book.ts";
import { GardState } from "wordgard/state";

function open(fname: string) {
	const client = new Database(fname, {
		experimental: ["custom_types", "index_method"],
	});
	return drizzle({ client });
}

async function migrate(db: ReturnType<typeof open>) {
	const curVersion = await db.get("PRAGMA user_version");
	console.log("migrate from", curVersion);
	// const schema = readFileSync("./migrations/turso/1.sql", "utf8");
	// await client.exec(schema);
}

// I prefer HTML for test documents storage since it's easier to acquire and
// author than Wordgard JSON.
GlobalRegistrator.register({
	url: "http://localhost:3000",
	width: 1920,
	height: 1080,
});

const db = open("./test.db");
await migrate(db);

// const wg = GardState.create({
// 	doc: readFileSync("testdata/gen-bsb.html", "utf8"),
// 	config: [book],
// });
//
// const db = await open();
//
// await db.transaction(async (tx) => {
// 	await tx
// 		.insert(doc)
// 		.values({
// 			id: docId,
// 			version: version,
// 			lang: "eng",
// 			book: "gen",
// 			title: "BSB",
// 		});
// 	await tx.insert(plot).values(rows);
// 	await tx.insert(changeSet).values({ id: version, ...cs });
// });
//
// await db.$client.close();
