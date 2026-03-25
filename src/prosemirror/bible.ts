// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.ts
// https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.ts
import { Schema } from "prosemirror-model";

function getClass(ele: HTMLElement): { class?: string } {
	const res: ReturnType<typeof getClass> = {};
	if (ele.className) res.class = ele.className;
	return res;
}

function validateId(v: any) {
	if (!(typeof v === "string" && v.split("/").length === 3))
		throw new Error(`invalid id ${v}`);
}

export const semantic = new Schema({
	nodes: {
		doc: {
			attrs: { id: { validate: validateId } },
			content: "block+",
			marks: "semantic",
		},
		// group: block
		p: {
			group: "block", // Cannot contain lists or blockquotes :(
			content: "inline*",
			attrs: {
				class: { default: null, validate: "string|null" },
				dir: {
					default: null,
					validate(s) {
						const valid = [null, "ltr", "rtl"];
						if (!valid.includes(s))
							throw new Error(`invalid dir ${s} not in ${valid}`);
					},
				},
			},
			toDOM: (node) => ["p", node.attrs, 0],
			parseDOM: [
				{
					tag: "p",
					getAttrs(ele) {
						const res: Record<string, string> = getClass(ele);
						if (ele.dir === "rtl") res.dir = "rtl";
						return res;
					},
				},
			],
		},
		heading: {
			group: "block",
			content: "inline*",
			marks: "publisher",
			attrs: { level: { default: 3, validate: "number" } },
			toDOM: (node) => [`h${node.attrs.level}`, 0],
			parseDOM: [
				{ tag: "h1", attrs: { level: 1 } }, // document name
				{ tag: "h2", attrs: { level: 2 } }, // chapter number
				{ tag: "h3", attrs: { level: 3 } }, // section heading
				{ tag: "h4", attrs: { level: 4 } }, // subheading
				{ tag: "h5", attrs: { level: 5 } }, // subsub heading
				{ tag: "h6", attrs: { level: 6 } }, // subsubsub heading
			],
			defining: true,
		},
		blockquote: {
			group: "block",
			content: "block*",
			attrs: { cite: { default: null, validate: "string" } },
			toDOM: (node) => ["blockquote", node.attrs, 0],
			parseDOM: [
				{
					tag: "blockquote",
					getAttrs: (ele) => ({ cite: ele.getAttribute("cite") }),
				},
			],
			defining: true,
		},
		ol: {
			// I tried arguing with the HTML5 spec for lists to be inline but I lost.
			group: "block",
			content: "li*",
			attrs: {
				class: { default: null, validate: "string" },
				start: { default: 1, validate: "number" },
			},
			toDOM: (node) => ["ol", node.attrs, 0],
			parseDOM: [
				{
					tag: "ol",
					getAttrs(ele) {
						const res: Record<string, string | number> = getClass(ele);
						const start = ele.getAttribute("start");
						if (start) res.start = parseInt(start);
						return res;
					},
				},
			],
		},
		ul: {
			group: "block",
			content: "li*",
			attrs: { class: { default: null, validate: "string" } },
			toDOM: (node) => ["ul", node.attrs, 0],
			parseDOM: [{ tag: "ul", getAttrs: getClass }],
		},
		hr: {
			group: "block",
			parseDOM: [{ tag: "hr" }],
			toDOM: () => ["hr", 0],
		},
		// group: inline (may store marks)
		text: {
			inline: true,
			group: "inline",
		},
		verseNum: {
			inline: true,
			group: "inline",
			attrs: { number: { validate: "number" } },
			draggable: true,
			toDOM: (node) => ["sup", { class: "verse" }, node.attrs.number.toString()],
			parseDOM: [
				{
					tag: "sup.verse",
					getAttrs: (node) => ({ number: parseInt(node.innerText) }),
				},
				{
					tag: "span.fnv",
					getAttrs: (node) => ({ number: parseInt(node.innerText) }),
				},
			],
		},
		br: {
			inline: true,
			group: "inline",
			selectable: false,
			toDOM: () => ["br"],
			parseDOM: [{ tag: "br" }],
		},
		footnote: {
			inline: true,
			group: "inline",
			content: "block+",
			marks: "publisher semantic",
			// This makes the view treat the node as a leaf, even though it
			// technically has content
			atom: true,
			toDOM: () => ["sup", { class: "footnote" }, 0],
			parseDOM: [{ tag: "sup.footnote" }],
		},
		img: {
			inline: true,
			group: "inline",
			attrs: {
				src: { validate: "string" },
				alt: { default: null, validate: "string|null" },
				title: { default: null, validate: "string|null" },
			},
			draggable: true,
			parseDOM: [
				{
					tag: "img[src]",
					getAttrs(dom: HTMLElement) {
						return {
							src: dom.getAttribute("src"),
							title: dom.getAttribute("title"),
							alt: dom.getAttribute("alt"),
						};
					},
				},
			],
			toDOM: ({ attrs: { src, alt, title } }) => ["img", { src, alt, title }],
		},
		// ungrouped
		li: {
			content: "block+",
			toDOM: (node) => ["li", node.attrs, 0],
			parseDOM: [{ tag: "li" }],
			defining: true,
		},
	},
	marks: {
		word: {
			group: "semantic",
			attrs: {
				id: { default: 0 },
				conllu: { default: null },
				isTetragram: { default: false },
				sources: { default: [] },
				verse: { default: -1 },
				before: { default: -1 },
				after: { default: -1 },
			},
			// Span-per-word is quite expensive. 70ms -> 684ms in benchmark:
			// https://jsfiddle.net/cdeyLmvz/2/
			toDOM: ({ attrs }) => [
				"span",
				{
					class: ["word", attrs.isTetragram ? "tetragram" : ""].join(""),
					id: attrs.id,
				},
				0,
			],
			parseDOM: [{ tag: "span.word" }],
		},
		q: {
			group: "semantic",
			attrs: { cite: { default: null, validate: "string" } },
			toDOM: (node) => ["q", node.attrs, 0],
			parseDOM: [
				{ tag: "q", getAttrs: (ele) => ({ cite: ele.getAttribute("cite") }) },
			],
		},
		// publisher
		em: {
			group: "publisher",
			toDOM: (node) => ["em", node.attrs, 0],
			parseDOM: [
				{ tag: "i" },
				{ tag: "em" },
				{ style: "font-style=italic" },
				{ style: "font-style=normal", clearMark: (m) => m.type.name == "em" },
			],
		},
		strong: {
			group: "publisher",
			toDOM: (node) => ["strong", node.attrs, 0],
			parseDOM: [
				{ tag: "strong" },
				// This works around a Google Docs misbehavior where
				// pasted content will be inexplicably wrapped in `<b>`
				// tags with a font-weight normal.
				{
					tag: "b",
					getAttrs: (node: HTMLElement) =>
						node.style.fontWeight != "normal" && null,
				},
				{ style: "font-weight=400", clearMark: (m) => m.type.name == "strong" },
				{
					style: "font-weight",
					getAttrs: (value: string) =>
						/^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
				},
			],
		},
	},
});
// link: {
// 	attrs: {
// 		href: { validate: "string" },
// 		title: { default: null, validate: "string|null" },
// 	},
// 	inclusive: false,
// 	toDOM: ({ attrs: { href, title } }) => ["a", { href, title }, 0],
// 	parseDOM: [
// 		{
// 			tag: "a[href]",
// 			getAttrs(ele) {
// 				return {
// 					href: ele.getAttribute("href"),
// 					title: ele.getAttribute("title"),
// 				};
// 			},
// 		},
// 	],
// },
