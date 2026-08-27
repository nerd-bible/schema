import {
	blockquote,
	blockDoc,
	heading,
	lineBreak,
	paragraph,
	div,
	punctCorrections,
} from "./common.ts";
import { correctVerseNum, verseNum } from "./verse.ts";
import { chapter } from "./chapter.ts";

export default [
	blockDoc(),
	heading(),
	chapter(),
	div(),
	blockquote(),
	paragraph(),
	verseNum(),
	lineBreak(),
	punctCorrections,
	correctVerseNum,
];
