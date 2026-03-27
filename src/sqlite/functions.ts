// Useful until release of Rust app, then these need to be rewritten in C.
import * as stemmers from "../stemmers/index.ts";

type SQLValue = null | number | bigint | string;
export function stemmer(lang: SQLValue, text: SQLValue): SQLValue {
	if (typeof text !== "string") return null;

	if (lang === "eng") return stemmers.eng(text);
	return null;
}
