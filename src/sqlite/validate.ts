import type { Db } from "./ingest.ts";
import * as stemmers from "../stemmers/index.ts";
import type { WordSearch } from "../schema/tables.ts";
import { ingest } from "./index.ts";

// TODO: some language normalization (contractions, numbers, abbreviations, spelling)
// https://github.com/shelfio/text-normalizer/blob/master/src/english-mapping.ts
export async function validate(db: Db) {
	const invalid = await db.run(
		"select id, lang from wordSearchInvalid join doc on doc.id = doc",
	);

	for (const { id: docId, lang: docLang } of invalid) {
		const wordSearch: WordSearch[] = [];
		const words = await db.run(`
select pos, text, coalesce(m.data, d.lang) as lang
from word
join doc d on d.id=word.doc
left join mark m on m.doc=word.doc and m.start=pos and m.tag='lang'
left join mark m2 on m2.doc=word.doc and m2.start=pos and m2.tag='ref'
where word.doc=${docId} and m2.tag!='ref'
`);
		let i = 0n;
		for (const { pos: wordPos, text, lang: wordLang } of words) {
			const lang = wordLang ?? docLang;
			const stemmer = stemmers[lang as keyof typeof stemmers];
			if (!stemmer) throw new Error("no stemmer for lang " + lang);
			const stem = stemmer(text);
			if (stem) {
				wordSearch.push({
					doc: docId,
					word: wordPos,
					plane: 0,
					pos: i++,
					stem,
				});
			}
		}
		await ingest.rows(db, "wordSearch", wordSearch);
		await db.exec(`delete from wordSearchInvalid where doc=${docId}`);
	}
}
