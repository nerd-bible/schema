import { Database } from "@tursodatabase/database";

const db = new Database(":memory:", {
	experimental: ["custom_types", "index_method"],
});
await db.connect();

// works
await db.exec(`CREATE TABLE foo (tags TEXT[]) STRICT`);
const foo = await db.prepare("INSERT INTO foo (tags) VALUES (array(?))");
await foo.run("'alice','bob'");

const foo2 = await db.prepare("INSERT INTO foo (tags) VALUES (?)");
await foo2.run(['alice']);

// doesn't work
await db.exec(`CREATE TABLE bar (tags BLOB[]) STRICT`);
const bar = await db.prepare("INSERT INTO bar (tags) VALUES (array(?))");
await bar.run("x'deadbeef',x'cafebabe'");

console.log(
await db.all("select * from bar")
)
