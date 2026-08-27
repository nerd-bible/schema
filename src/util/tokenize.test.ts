import { test } from "node:test";
import expect from "expect";
import { tokenize } from "./tokenize.ts";

test("tokenize", () => {
	expect(tokenize("Welcome, nerdy friend.", "eng")).toEqual([
		{ before: "", text: "Welcome", after: "," },
		{ before: " ", text: "nerdy", after: "" },
		{ before: " ", text: "friend", after: "." },
	]);

	expect(tokenize("Tubal-Cain", "eng")).toEqual([
		{ before: "", text: "Tubal", after: "" },
		{ before: "-", text: "Cain", after: "" },
	]);

	expect(tokenize("אֶחָֽד׃פ", "heb")).toEqual([
		{ before: "", text: "אֶחָֽד", after: "׃" },
		{ before: "", text: "פ", after: "" },
	]);
});
