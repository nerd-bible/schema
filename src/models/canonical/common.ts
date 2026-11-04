import { Plot, Node, Leaf } from "wordgard/doc";
import {
	LineBreak,
	Blockquote,
	Heading as WgHeading,
	Strong,
	Emphasis,
} from "wordgard/types";

export { LineBreak, Blockquote, Strong, Emphasis };

export const Doc = Plot.defineDoc({
	blockContent: Node.Group.Content,
	canBeEmpty: true,
});

export const Paragraph = Plot.Type.define<string>("Paragraph", {
	defaultParam: "",
	inlineContent: true,
	group: Node.Group.Content,
	defaultBlock: true,
	shape: {
		element: "p",
		attributes: (claz) => ({ ...(claz ? { class: claz } : {}) }),
	},
	parseRules: [{ selector: "p", readElement: (ele) => ele.className }],
});

export const Heading = Plot.Type.define("Heading", {
	...WgHeading.spec,
	inlineContent: Leaf.Text,
	defaultParam: 3,
});

// export const Div = Plot.Type.define("Div", {
// 	defaultParam: "",
// 	blockContent: Node.Group.Content,
// 	group: Node.Group.Block,
// 	shape: {
// 		element: "div",
// 		readElement: (e) => e.className,
// 		attributes: (a) => ({ class: a }),
// 	},
// });

// const InlineFragment = Plot.define("Fragment", {
//   inline: true,
//   shape: {element: "span"},
//   inlineContent: true
// });
