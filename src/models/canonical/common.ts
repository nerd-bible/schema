import { Plot, Node } from "wordgard/doc";
import {
	Paragraph,
	LineBreak,
	Blockquote,
	Doc,
	Heading as WgHeading,
} from "wordgard/types";

export { Paragraph, LineBreak, Blockquote, Doc };

export const Heading = Plot.Type.define("Heading", {
	...WgHeading.spec,
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
