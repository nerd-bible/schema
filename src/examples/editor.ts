import { RangeSet, Wordgard, menuBar } from "wordgard/editor";
import book from "../wordgard/book.ts";
import { history } from "wordgard/history";
import { ChangeSet, type Leaf, type Plot } from "wordgard/doc";
import { tokenize } from "../util/tokenize.ts";
import { Heading } from "../wordgard/common.ts";
import { VerseNum } from "../wordgard/verse.ts";
import { GardSelection, GardState } from "wordgard/state";
import { backgroundColor } from "wordgard/schema";
import { BackgroundColor } from "wordgard/types";
import { toTabular } from "../wordgard/toTabular.ts";
import html from "../../genesis.html?raw";

const wg = Wordgard.create({
	parent: document.body.appendChild(document.createElement("div")),
	doc: html,
	config: [
		Wordgard.label("Editor"),
		book,
		history(),
		menuBar(),
		// Wordgard.transactionListener.of(transactions => {
		// 	for (const t of transactions) {
		// 		if (t.changes.empty) continue;
		// 		console.log("t", t.changes.toJSON());
		// 	}
		// 	return transactions;
		// }),
		// GardState.readOnly.of(true),
		// Wordgard.editable.of(false),
		// Wordgard.contentAttributes.of({ tabindex: "0" }),
	],
});
window.wg = wg;

const { doc } = wg.state;
const ranges: [number, number, number][] = [];

console.log(doc.toJSON());
console.time("toTabular");
const tabular = toTabular(doc);
console.timeEnd("toTabular");
console.log(tabular);
// let wordI = 0;
// const loadFactor = 0.8;
// const maxInt = BigInt("0x" + "F".repeat(16));

// doc.iterate(
// 	(node: Plot | Leaf, pos: number, parent: Plot | null, index: number) => {
// 		if (!node.isLeaf || !parent) return;
//
// 		if (parent.tag.is(Heading) && parent.tag.param == 2) {
// 		} else if (parent.tag.is(VerseNum.type)) {
// 		} else {
// 			console.log(node.param, parent!.tag);
// 			let wordStart = pos;
// 			for (const w of tokenize(node.param as string, "eng")) {
// 				const wLen = w.before.length + w.text.length + w.after.length;
// 				ranges.push([wordStart, wordStart + wLen, wordI++]);
// 				wordStart += wLen;
// 			}
// 		}
// 	},
// );


// const changes = ranges.map((r, i) => ({
// 	from: r[0],
// 	to: r[1],
// 	add: BackgroundColor.of(i % 2 ? "red" : "green"),
// }));
// wg.dispatch({ effects: GardState.appendConfig.of(backgroundColor()) });
// wg.dispatch({ changes });
