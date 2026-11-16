import { Plot, Leaf, Mark, ValidationError } from "wordgard/doc";

export * from "./base.ts";

// Prevent marks like Superscript from nesting. Also nice semantic difference
// from footnotes.
export const VerseNum = Plot.define("VerseNum", {
	inline: true,
	inlineContent: Leaf.Text,
	shape: { element: "sup", attributes: { class: "versenum" } },
	parseRules: [
		{ selector: ".ref" },
		{ selector: ".reftext" }, // biblehub
		{ selector: ".verse" },
		{ selector: ".versenum" }, // biblegateway
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

function parseInt(s?: string | null) {
	if (s == null) return;
	const maybe = Number.parseInt(s);
	if (Number.isNaN(maybe)) return;
	return maybe;
}

export const Smooth = Mark.Type.define("Smooth", {
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
	rank: 9,
	shape: {
		element: "span",
		attributes: (n) => ({ class: "smooth", "data-level": n.toString() }),
		readElement: (elt) => parseInt(elt.getAttribute("data-level")) ?? 1,
	},
	parseRules: [
		{
			selector: "span.smooth",
			readElement: (elt) => parseInt(elt.getAttribute("data-level")) ?? 1,
		},
	],
});

// function getChapterNumber(heading: Plot | null) {
// 	if (heading?.tag.is(Heading) && heading.tag.param == 2) {
// 		const text = heading.textContent();
// 		if (text == "") return text;
// 		const match = text.match(/\d+/);
// 		if (match) return Number.parseInt(match[0]);
// 	}
// }
//
// export const correctChapters = Correction.onContent(Heading, (heading) => {
// 	if (!heading.node.tag.is(Heading) || heading.node.tag.param != 2) return null;
//
// 	const n = getChapterNumber(heading.node);
// 	if (n?.toString() != heading.node.textContent()) {
// 		for (let i = heading.index - 1; i > 0; i--) {
// 			const prevN = getChapterNumber(heading.parent?.node.content[i] as Plot);
// 			if (prevN)
// 				return {
// 					from: heading.start,
// 					to: heading.end,
// 					insert: [Leaf.Text.of((prevN + 1).toString())],
// 				};
// 		}
// 		return {
// 			from: heading.start,
// 			to: heading.end,
// 			insert: [Leaf.Text.of(n?.toString() ?? "1")],
// 		};
// 	}
// 	return null;
// });
