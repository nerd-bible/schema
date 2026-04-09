// Useful until release of Rust app, then these need to be rewritten in C.
import * as stemmers from "../stemmers/index.ts";

type SQLValue = null | number | bigint | string;
export function stemmer(lang: any, text: any): SQLValue {
	if (typeof text !== "string") return null;

	if (lang === "eng") return stemmers.eng(text);
	return null;
}

export function spanContains(
	start: any,
	startSide: any,
	end: any,
	endSide: any,
	word: any,
): SQLValue {
	const inStart = startSide ? start < word : start <= word;
	const inEnd = endSide ? end >= word : end > word;

	return inStart && inEnd ? 1 : 0;
}
