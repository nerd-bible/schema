import { Plot, Node, Leaf } from "wordgard/doc";
import { Heading as WgHeading } from "wordgard/types";
export {
	Alignment,
	BackgroundColor,
	Blockquote,
	CaptionedFigure,
	Cell,
	ColSpan,
	Color,
	Direction,
	Emphasis,
	Figure,
	HeaderCell,
	HorizontalRule,
	Image,
	ImageAlt,
	ImageSize,
	LineBreak,
	RowSpan,
	Strikethrough,
	Strong,
	Subscript,
	Table,
	TableRow,
	Underline,
} from "wordgard/types";

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

export const Break = Leaf.Type.define("Break", {
	defaultParam: "",
	inline: true,
	selectable: true,
	shape: {
		element: "span",
		attributes: (a) => ({ class: ["break", a].join(" ") }),
		atom: true,
	},
	parseRules: [{ selector: "span.break" }],
});

export const ListItem = Plot.define("ListItem", {
	blockContent: Node.Group.Content,
	shape: { element: "div", attributes: { role: "listitem" } },
	defining: true,
});

export const InlineListItem = Plot.define("InlineListItem", {
	inline: true,
	inlineContent: true,
	shape: { element: "span", attributes: { role: "listitem" } },
	defining: true,
});

// only block lists can distinguish between ordered/unordered
// to keep the params the same for inline lists, don't use <ol> or <ul>
export const List = Plot.define("List", {
	blockContent: ListItem,
	group: Node.Group.Content,
	role: Node.Role.List,
	defining: true,
	shape: {
		element: "div",
		attributes: { role: "list" },
	},
	parseRules: [
		{ selector: "ul" },
		{ selector: "ol" },
		{ selector: "menu" },
	],
});

export const InlineList = Plot.define("InlineList", {
	inline: true,
	inlineContent: InlineListItem,
	role: Node.Role.List,
	defining: true,
	shape: {
		element: "span",
		attributes: { role: "list" },
	},
});

// export const Div = Plot.Type.define("Div", {
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
