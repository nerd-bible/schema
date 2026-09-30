// adds STRICT to CREATE TABLE and uses sane file names
import {
	generateDrizzleJson,
	generateMigration,
} from "drizzle-kit/payload/sqlite";
import * as schema from "./models/tabular/schema.ts";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outdir = "migrations/turso";

mkdirSync(outdir, { recursive: true });

const files = [...readdirSync(outdir)].sort();
const fromFname = files.filter((f) => f.endsWith(".json")).at(-1);

const from = fromFname
	? JSON.parse(readFileSync(resolve(outdir, fromFname), "utf8"))
	: await generateDrizzleJson({});
const to = await generateDrizzleJson(schema);

function getPrevId() {
	const maybe = Number.parseInt(fromFname?.replace(".json", "") ?? "");
	if (Number.isNaN(maybe)) return 0;
	return maybe;
}

const fromId = getPrevId();
const toId = fromId + 1;
console.log("migrating from", fromId ?? "nothing", "to", toId);

const migration = (await generateMigration(from, to)).map((sql) => {
	if (sql.startsWith("CREATE TABLE")) return sql.replace(");", ") STRICT;");
	return sql;
});

if (migration.length) {
	writeFileSync(resolve(outdir, toId + ".json"), JSON.stringify(to, null, 2));
	writeFileSync(resolve(outdir, toId + ".sql"), migration.join("\n"));
	console.log(migration.length, "statements in", outdir);
} else {
	console.log("nothing to do");
}
