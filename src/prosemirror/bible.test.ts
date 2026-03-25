import { semantic } from "./bible.ts";
import { DOMSerializer, type Node } from "prosemirror-model";

const { nodes, marks } = semantic;

const cnum = nodes.heading.create({ level: 2 }, semantic.text("1"));

const para = nodes.paragraph.create(null, [
	semantic.text("In").mark([
		marks.conllu.create({
			id: 1,
			lemma: "in",
			upos: "PREP",
		}),
	]),
	semantic.text(" the beginning God created the heavens and the Earth. Now "),
	semantic.text("the earth was formless and void and darkness was hovering "),
	semantic.text("over the surface of the deep."),
]);

const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
const docChildren: Node[] = [cnum];
for (const s of segmenter.segment(para.textContent)) {
	const slice = para.slice(s.index, s.index + s.segment.length);
	docChildren.push(
		nodes.sentence.create(
			{ id: 1 },
			nodes.paragraph.create(para.attrs, slice.content),
		),
	);
}

const doc = nodes.doc.create({ id: "gen/en/bsb", published: new Date(2024, 11) }, docChildren);
console.log(JSON.stringify(doc.toJSON(), null, 2))

// import { Window } from "happy-dom";
// const window = new Window({ url: "https://localhost:8080" });
// (globalThis as any).window = window;
// (globalThis as any).document = window.document;
// const fragment = DOMSerializer.fromSchema(semantic).serializeFragment(
// 	doc.content,
// );
// const div = document.createElement("div");
// div.appendChild(fragment);
// console.log(div.innerHTML);
