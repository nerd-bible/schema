async function migrate(db: ReturnType<typeof open>) {
	const curVersion = await db.get("PRAGMA user_version");
	console.log("migrate from", curVersion);
	// const schema = readFileSync("./migrations/turso/1.sql", "utf8");
	// await client.exec(schema);
}
