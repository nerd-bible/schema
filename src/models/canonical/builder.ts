import { GardState } from "wordgard/state";
import type { Meta } from "./meta.ts";
import * as z from "zod";
import type { SourceMap } from "./sourceMap";
import { Leaf, Mark, Plot, Node } from "wordgard/doc";
import type { Token as WgToken } from "wordgard/doc";

export type Doc = {
	type: "doc";
	schema: number;
	meta: Meta;
	doc: Node.JSON;
};
export type SourceMap = {
	type: "sourcemap";
	source: Meta["id"];
	target: Meta["id"];
	map: z.infer<typeof SourceMap>;
};

// We could allow Plot.Tag if we created a Node for them, but be lazy for now.
type Token = Exclude<WgToken, Plot.Tag>;

export class Builder {
	meta: Meta;
	xrefs: Record<string, Builder> = {};
	xrefsMap: Record<string, z.infer<typeof SourceMap>> = {};
	// I originally used `GardState`, but each `.update` fully validates the
	// entire document, which is slow.
	// Instead we'll directly mutate a document (working around the `readonly`
	// types) and validate it once at the end.
	doc: Plot.Doc;
	stack: Plot[] = [];
	lastInsert: Node;
	activeMarks: Mark.Set = [];

	constructor(config: GardState.Extension, meta: Meta) {
		const resolved = GardState.Configuration.create(config);
		this.doc = this.lastInsert = resolved.schema!.doc([]);
		this.meta = meta;
	}

	finish(validate = true): (Doc | SourceMap)[] {
		if (validate) this.doc.schema.validate(this.doc);

		for (const a of Object.values(this.xrefs)) {
			const annotates = (a.meta.xrefs ??= []);
			annotates.push(this.meta.id);
		}

		const res: ReturnType<typeof this.finish> = [];
		const finished: Doc = {
			type: "doc",
			schema: 1,
			meta: this.meta,
			doc: this.doc.toJSON(),
		};
		for (const s in this.xrefs) {
			const xref = this.xrefs[s];
			const source = this.xrefsMap[s];
			if (source) {
				finished.meta.sources ??= [];
				finished.meta.sources.push(xref.meta.id);
				res.push({
					type: "sourcemap",
					source: xref.meta.id,
					target: this.meta.id,
					map: source,
				});
			} else {
				finished.meta.xrefs ??= [];
				finished.meta.xrefs.push(xref.meta.id);
				res.push(...xref.finish());
			}
		}
		res.push(finished);

		return res;
	}

	get parent() {
		return this.stack.at(-1) ?? this.doc;
	}

	insert(...tokens: (Token | string)[]) {
		for (const t of tokens) {
			if (t == Plot.End) {
				this.stack.pop();
				continue;
			}

			const parent = this.parent;
			const insert = (
				(typeof t == "string" ? Leaf.text(t) : t) as Node
			).withMarks(this.activeMarks);

			// workaround WordGard.Node.create(content = [])
			if (parent.content.length == 0) (parent.content as Node[]) = [];

			// optimize text concatenation
			if (
				this.lastInsert.isText &&
				insert.isText &&
				Mark.sameSet(this.lastInsert.marks, insert.marks)
			) {
				(this.lastInsert as any).param += insert.param;
			} else {
				(parent.content as Node[]).push(insert);
				this.lastInsert = insert;
			}

			// update contentLength ourselves
			for (const s of this.stack) s.contentLength += insert.length;
			this.doc.contentLength += insert.length;

			if (insert.isPlot) this.stack.push(insert);
		}
	}

	isEmpty() {
		return this.doc.length <= 2;
	}

	get cursor() {
		return this.doc.length - this.stack.length;
	}

	get schema() {
		return this.doc.schema;
	}

	isInsertValid(n: Node) {
		return this.schema.canContain(this.parent.type, n.type);
	}

	toString(n: Node = this.doc, depth = 0) {
		let res = "\t".repeat(depth);
		if (!n.isText) res += n.type.name;
		if (n.isPlot) {
			for (const n2 of n.content) {
				res += n.content.length > 1 ? "\n" : " ";
				res += this.toString(n2, depth + 1);
			}
		} else {
			if (!n.isText && !n.type.hasRole(Node.Role.LineBreak)) res += "\n";

			if (n.param) res += JSON.stringify(n.param);
			if (n.marks.length) res += `[${n.marks.map((m) => m.name).join(",")}]`;
		}
		return res;
	}

	activate(mark: Mark) {
		this.activeMarks = mark.addToSet(this.activeMarks);
	}

	deactivate(mark: Mark) {
		this.activeMarks = mark.removeFromSet(this.activeMarks);
	}
}
