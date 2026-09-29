import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "turso",
	schema: "./src/tabular/schema.ts",
	out: "./migrations/turso",
});
