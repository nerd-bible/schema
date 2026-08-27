import { Plot, Leaf, Elt } from "wordgard/doc";
import { Correction } from "wordgard/state";
import { Decoration, Widget, Wordgard } from "wordgard/editor";
import { Heading } from "./common";

function getChapterNumber(heading: Plot | null) {
	if (heading?.tag.is(Heading) && heading.tag.param == 2) {
		const text = heading.textContent();
		if (text == "") return text;
		const match = text.match(/\d+/);
		if (match) return Number.parseInt(match[0]);
	}
}

export const correctChapters = Correction.onContent(Heading, (heading) => {
	if (!heading.node.tag.is(Heading) || heading.node.tag.param != 2) return null;

	const n = getChapterNumber(heading.node);
	if (n?.toString() != heading.node.textContent()) {
		for (let i = heading.index - 1; i > 0; i--) {
			const prevN = getChapterNumber(heading.parent?.node.content[i] as Plot);
			if (prevN)
				return {
					from: heading.start,
					to: heading.end,
					insert: [Leaf.Text.of((prevN + 1).toString())],
				};
		}
		return {
			from: heading.start,
			to: heading.end,
			insert: [Leaf.Text.of(n?.toString() ?? "1")],
		};
	}
	return null;
});

export const chapterStyles = Wordgard.styles({
	h2: {
		"&::before": {
			content: "'Chapter '",
		},
	},
});

// const chapterDeco = Decoration.Tag.shape(Heading.of(2), tag => {
// 	if (tag.param === 2) return Elt.mk("h2", ["Chapter ", 0]);
// 	return Elt.mk("h2", [0]);
// });

export function chapter() {
	return [correctChapters, chapterStyles];
}
