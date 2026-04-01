import { test } from "node:test";
import expect from "expect";
import { tokenize } from "./builder.ts";

test("tokenize", () => {
	expect(tokenize("Welcome, nerdy friend.", "heb")).toEqual([
		{ before: "", text: "Welcome", after: "," },
		{ before: " ", text: "nerdy", after: "" },
		{ before: " ", text: "friend", after: "." },
	]);

	expect(tokenize("אֶחָֽד׃פ", "heb")).toEqual([
		{ before: "", text: "אֶחָֽד", after: "׃" },
		{ before: "", text: "פ", after: "" },
	]);
});
