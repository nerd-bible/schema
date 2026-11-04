import {
	Blockquote,
	Doc,
	Heading,
	LineBreak,
	Paragraph,
	Strong,
	Emphasis,
} from "./common.ts";
import { Leaf, Mark, Plot, Schema, ValidationError } from "wordgard/doc";

export { Blockquote, Doc, Heading, LineBreak, Paragraph, Strong, Emphasis };
export { Leaf };

export const VerseNum = Plot.define("VerseNum", {
	inline: true,
	inlineContent: Leaf.Text,
	shape: { element: "sup" },
});

export const Whitespace = Leaf.Type.define("Whitespace", {
	defaultParam: "",
	inline: true,
	selectable: true,
	shape: {
		element: "span",
		attributes: (a) => ({ class: "whitespace " + a }),
	},
	parseRules: [{ selector: "span.whitespace" }],
});

function parseInt(s?: string | null) {
	if (s == null) return;
	const maybe = Number.parseInt(s);
	if (Number.isNaN(maybe)) return;
	return maybe;
}

export const Smoothed = Mark.Type.define("Smoothed", {
	defaultParam: 1,
	validate: (value) => {
		if (
			typeof value != "number" ||
			Math.floor(value) != value ||
			value < 1 ||
			value > 6
		)
			throw new ValidationError(`Invalid heading level: ${value}`);
	},
	rank: 10,
	shape: {
		element: "span",
		attributes: (n) => ({ "data-level": n.toString() }),
		readElement: (elt) => parseInt(elt.getAttribute("data-level")) ?? 1,
	},
	parseRules: [
		{
			selector: "span[data-level]",
			readElement: (elt) => parseInt(elt.getAttribute("data-level")) ?? 1,
		},
		{ selector: "em" },
		{ attribute: "style/font-style", value: "italic" },
		{
			attribute: "style/font-style",
			value: "normal",
			clearMark: (p) => p.name == "Smoothed",
		},
	],
});

// export const correctVerseNum = Correction.onContent(VerseNum, (node) => {
// 	const changes: ChangeSet.Spec[] = [];
// 	const content = node.node.textContent();
//
// 	if (!verseRegexSpace.test(content)) {
// 		const replacement = content.replace(/[^\d]/g, "");
// 		// "12a3" -> "123 "
// 		for (const [sx, ex, sy, ey] of diff(content, replacement))
// 			changes.push({
// 				from: node.start + sx,
// 				to: node.start + ex,
// 				insert: [Leaf.Text.of(replacement.substring(sy, ey))],
// 			});
// 	}
// 	return changes;
// });

export const schema: Schema.Element[] = [
	Doc,
	// blocks
	Heading,
	Paragraph,
	Blockquote,
	// inline
	LineBreak,
	VerseNum,
	Whitespace,
	// marks
	Smoothed,
	Strong, // for headings
	Emphasis, // for headings
	// corrections
	// correctVerseNum,
];
