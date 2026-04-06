import { openDb } from "./sample.ts";

const db = openDb();
let query = "";
for await (const chunk of process.stdin) query += chunk;

const res = db.prepare(query).all();
console.table(res);
