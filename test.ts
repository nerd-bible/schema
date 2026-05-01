import { Schema } from "prosemirror-model";

const noteSchema = new Schema({
	nodes: {
		doc: { content: "paragraph+" },
		text: {},
		paragraph: {
			content: "text*",
			toDOM: () => ["p", 0],
			parseDOM: [{ tag: "p" }],
		},
	},
	marks: {
		em: {
			toDOM: () => ["em", 0],
			parseDOM: [{ tag: "em" }],
		},
		strong: {
			toDOM: () => ["strong", 0],
			parseDOM: [{ tag: "strong" }],
		},
	},
});

const text1 = noteSchema.text("This is ");
const text2 = noteSchema
	.text("strong text with ")
	.mark([noteSchema.marks.strong.create()]);
const text3 = noteSchema
	.text("emphasis.")
	.mark([noteSchema.marks.em.create(), noteSchema.marks.strong.create()]);
const p = noteSchema.nodes.paragraph.create(null, [text1, text2, text3]);
const doc = noteSchema.nodes.doc.create(null, [p]);
const html = `<p>This is <strong>strong text with <em>emphasis.</em></strong></p>`;

doc.check();
console.dir(doc.toJSON(), { depth: null });
