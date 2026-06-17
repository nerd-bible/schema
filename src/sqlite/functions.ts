// Useful until release of Rust app, then these need to be rewritten in C.
import { eng } from "../stemmers/index.ts";

type SQLValue = null | number | bigint | string;
export function stemmer(lang: any, text: any): SQLValue {
	if (typeof text !== "string") return null;

	if (lang === "eng") return eng(text);
	return null;
}
