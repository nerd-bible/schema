import type { Db } from "./ingest.ts";
import * as stemmers from "../stemmers/index.ts";
import type { WordSearch } from "../typescript/tables.ts";
import { ingest } from "./index.ts";

// TODO: some language normalization (contractions, numbers, abbreviations, spelling)
// https://github.com/shelfio/text-normalizer/blob/master/src/english-mapping.ts
export function validate(db: Db) {
	const invalid = db.run(
		"select id, lang from wordSearchInvalid join doc on doc.id = doc",
	);

	for (const { id: docId, lang: docLang } of invalid) {
		const wordSearch: WordSearch[] = [];
		const words = db.run(`select id, text, lang from word where doc=${docId}`);
		let i = 0n;
		for (const { id: wordId, text, lang: wordLang } of words) {
			const lang = wordLang ?? docLang;
			if (lang === "r") continue;
			const stemmer = stemmers[lang as keyof typeof stemmers];
			if (!stemmer) throw new Error("no stemmer for lang " + lang);
			const stem = stemmer(text);
			if (stem) {
				wordSearch.push({
					doc: docId,
					word: wordId,
					plane: 0,
					pos: i++,
					stem,
				});
			}
		}
		ingest.rows(db, "wordSearch", wordSearch);
		db.exec(`delete from wordSearchInvalid where doc=${docId}`);
	}
}
