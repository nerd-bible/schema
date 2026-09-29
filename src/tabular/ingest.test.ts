import { Database } from "@tursodatabase/database";

import { drizzle } from "drizzle-orm/tursodatabase/database";
import { doc } from "./schema.ts";
import { readFileSync } from "node:fs";

const client = new Database(":memory:", {
	experimental: ["custom_types"],
});
await client.connect();
const db = drizzle({ client });

const schema = readFileSync("./migrations/turso/1.sql", "utf8");
console.log(schema);
console.log(await client.exec(schema));

console.log(await client.all("select * from sqlite_master where type='table'"));

// const prep = await db.insert(doc).values([{ lang: "eng", book: "gen" }]);
// console.log(prep);
// console.log(await db.select().from(doc));

// const db = await connect(':memory:', {
// 	experimental: ["custom_types"],
// });
// await db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT[]) STRICT');
// await db.exec("INSERT INTO users (name) VALUES (ARRAY['Alice', 'Allie'])");
// const users = await (await db.prepare('SELECT * FROM users')).raw(false).all()
// console.log(users); // { id: 1, name: '{Alice,Allie}' }
