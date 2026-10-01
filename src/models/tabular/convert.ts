import * as wg from "wordgard/doc";
import * as schema from "./schema.ts";
import type { InferInsertModel } from "drizzle-orm";
import { Leaf, Plot } from "wordgard/doc";
import { VerseNum } from "../wordgard/verse.ts";
import type { GardState } from "wordgard/state";

type Node = Leaf | Plot;
type Marks = { [name: string]: any };
type Content = ({ v: string } | { t: number }) & { marks?: Marks };

class BlockPlotSerializer {
	ctx: GardState;

	constructor(ctx: GardState) {
		this.ctx = ctx;
	}

	serialize(n: Node) {
		const maybeFn = (n.type.spec as any).encoders?.blockPlot;
		if (maybeFn) return maybeFn(n);
	}

	deserialize(n: ReturnType<Serializer["serialize"]>): Node {
	}
}

export async function toCanonical(
	doc: wg.Plot.Doc,
	docId: InferInsertModel<typeof schema.plot>["doc"],
) {
	const res: InferInsertModel<typeof schema.plot>[] = [];

	function textContent(node: Plot): string {
		let res = "";
		node.iterate((node) => {
			if (node.tag.is(VerseNum.type)) return false;
			if (node.isText) res += node.param as string;
		});
		return res;
	}

	function addMarks<T extends { marks?: Marks }>(node: Leaf | Plot, c: T): T {
		if (node.marks.length) {
			c.marks = {};
			for (let { name, value } of node.marks) c.marks![name] = value;
		}
		return c;
	}

	function makeContent(node: Plot): Content[] {
		let res: ReturnType<typeof makeContent> = [];

		node.iterate((c) => {
			if (c.tag.is(VerseNum.type)) {
				const text = (c as Plot).textContent();
				res.push(addMarks(c, { v: text } as Content));
				return false;
			} else if (c.isText) {
				res.push(addMarks(c, { t: c.length } as Content));
			}
		});

		return res;
	}

	function makeRow(
		node: Leaf | Plot,
		parent?: number,
		extra?: any,
	): InferInsertModel<typeof schema.plot> {
		return addMarks(node, {
			id: res.length + 1,
			doc: docId,
			type: node.tag.name,
			param: node.tag.param,
			length: node.length,
			parent,
			...extra,
		});
	}

	function pushRows(node: Leaf | Plot, parent?: number) {
		if (node instanceof Plot) {
			if (node.inlineContent) {
				// base case
				res.push(
					makeRow(node, parent, {
						text_content: textContent(node),
						content: makeContent(node),
					}),
				);
			} else {
				// recurse
				res.push(makeRow(node, parent));
				const parentId = res.length;
				for (const c of node.content) pushRows(c, parentId);
			}
		}
		return false;
	}

	doc.iterate((node) => pushRows(node));

	return res;
}
