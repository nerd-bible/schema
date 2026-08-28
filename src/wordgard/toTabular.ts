import { Leaf, Plot } from "wordgard/doc";
import { Heading } from "../wordgard/common.ts";
import * as t from "../tabular/tables.ts";
import { VerseNum } from "./verse.ts";
import { tokenize } from "../util/tokenize.ts";
import * as stemmers from "../stemmers/index.ts";

const maxInt = BigInt("0x" + "F".repeat(16));

function isChapter(node: Plot | Leaf) {
	return node.tag.is(Heading) && node.tag.param == 2;
}

function isVerse(node: Plot | Leaf) {
	return node.tag.is(VerseNum.type);
}

export function toTabular(
	doc: Plot.Doc,
	docId: bigint = 1n,
	loadFactor = 0.8,
): {
	plots: t.Plot[];
	words: t.Word[];
	refs: t.Ref[];
} {
	const plots: t.Plot[] = [];
	const words: t.Word[] = [];
	const refs: t.Ref[] = [];
	const plotMap = new WeakMap<Plot, bigint>();
	let chapter = 1;
	let wordI = 0;

	doc.iterate((node: Plot | Leaf, pos: number, parent: Plot | null) => {
		if (!parent) throw new Error("expected parent");

		// chapter + verse inline plots -> refs
		if (node.is(Leaf.Text)) {
			if (isChapter(parent)) {
				chapter = Number.parseInt(node.param);
				refs.push({
					doc: docId,
					pos: BigInt(wordI++),
					chapter,
				});
				return;
			}
			if (isVerse(parent)) {
				refs.push({
					doc: docId,
					pos: BigInt(wordI++),
					chapter,
					verse: Number.parseInt(node.param),
				});
				return;
			}
		}

		// plots -> plots
		if (node.isPlot && !isChapter(node) && !isVerse(node)) {
			const start = BigInt(wordI++);
			plotMap.set(node, BigInt(plots.length));
			plots.push({
				doc: docId,
				tag: node.tag.name,
				// attrs: node.tag.param,
				attrs: node.textContent(),
				start,
				end: BigInt(wordI),
				parent: plotMap.get(parent),
			});
			return;
		}
		if (node.is(Leaf.Text)) {
			// leaf -> word
			let wordStart = pos;
			for (const w of tokenize(node.param as string, "eng")) {
				const wLen = w.before.length + w.text.length + w.after.length;
				// wordStart, wordStart + wLen, wordI++
				words.push({
					doc: docId,
					pos: BigInt(wordI++),
					text: w.before + w.text + w.after,
					stem: stemmers.eng(w.text),
				});
				wordStart += wLen;
			}

			// resolve parent plot end
			for (
				let parentPlot = plots.at(-1);
				parentPlot;
				parentPlot = plots[Number(parentPlot.parent)]
			) {
				parentPlot.end = BigInt(wordI);
			}
		}
	});

	// const totalCount = plots.length + words.length + refs.length;
	// for (const p of plots) p.start

	return { plots, words, refs };
}
