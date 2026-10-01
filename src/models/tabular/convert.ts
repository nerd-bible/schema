import * as wg from "wordgard/doc";
import * as schema from "./schema.ts";
import type { InferInsertModel } from "drizzle-orm";
import { Leaf, Plot } from "wordgard/doc";
import { VerseNum } from "../wordgard/verse.ts";
import { generateKeyBetween } from "fractional-indexing";

type Marks = { [name: string]: any };
type Content = ({ v: string } | { t: number }) & { marks?: Marks };

class BlockPlotSerializer {
	res: InferInsertModel<typeof schema.plot>[] = [];
	docId: bigint;

	constructor(docId: bigint) {
		this.docId = docId;
	}

	marks(m: wg.Mark.Set) {
		if (m.length) {
			let res: Marks = {};
			for (let { name, value } of m) res[name] = value;
			return res;
		}
	}

	leaf(node: Leaf) {
		if (node.isText) {
			const last = this.res.at(-1)!;
			last.text_content ??= "";
			last.text_content += node.param;
			last.content ??= [];
			last.content.push({ t: (node.param as string).length });
		}
	}

	plot(node: Plot, parent?: string) {
		const last = this.res.at(-1);
		if (node.inlineContent && node.tag.is(VerseNum.type)) {
			last!.content ??= [];
			last!.content.push({ v: node.textContent() });
			return;
		}

		const row = {
			id: generateKeyBetween(last?.id, null),
			doc: this.docId,
			type: node.tag.name,
			param: node.tag.param,
			length: node.length,
			parent,
			marks: this.marks(node.marks),
		};
		this.res.push(row);
		this.descend(node, row.id);
	}

	descend(node: Plot, parent?: string) {
		for (const c of node.content) {
			if (c.isPlot) this.plot(c, parent);
			else this.leaf(c);
		}
	}

	doc(d: Plot.Doc) {
		this.descend(d);
		return this.res;
	}
}

export async function toCanonical(
	doc: wg.Plot.Doc,
	docId: InferInsertModel<typeof schema.plot>["doc"],
) {
	const serializer = new BlockPlotSerializer(docId);
	serializer.doc(doc);
	return serializer.res;
}
