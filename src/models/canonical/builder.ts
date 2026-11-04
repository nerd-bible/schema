import { GardSelection, GardState } from "wordgard/state";
import type { Meta } from "./meta.ts";
import * as z from "zod";
import type { SourceMap } from "./sourceMap";
import { Leaf, Plot, type Node, type Token } from "wordgard/doc";

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

export class Builder {
	state: GardState;
	meta: Meta;
	xrefs: Record<string, Builder> = {};
	xrefsMap: Record<string, z.infer<typeof SourceMap>> = {};
	lastInsert?: Node | Plot.Tag;

	constructor(
		config: GardState.Extension | GardState.Configuration,
		meta: Meta,
	) {
		this.state = GardState.create({ config });
		this.meta = meta;
	}

	finish(): (Doc | SourceMap)[] {
		for (const a of Object.values(this.xrefs)) {
			const annotates = (a.meta.xrefs ??= []);
			annotates.push(this.meta.id);
		}

		const res: ReturnType<typeof this.finish> = [];
		const finished: Doc = {
			type: "doc",
			schema: 1,
			meta: this.meta,
			doc: this.state.doc.toJSON(),
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

	insert(...tokens: (Token | string)[]) {
		let { from, to } = this.state.selection.replacementRange;
		// Wordgard errors if there's no plot to close. We really just mean move
		// onto the next block.
		if (tokens[0] == Plot.End) {
			const maxCursor = this.state.doc.length;
			from = Math.min(maxCursor, from + 1);
			to = Math.min(maxCursor, to + 1);
			tokens = tokens.slice(1);
		}
		const insert = (
			tokens.filter((t) => t != Plot.End) as (Node | Plot.Tag)[]
		).map((t) => (typeof t == "string" ? Leaf.text(t) : t));
		const tr = this.state.update({
			changes: { from, to, insert },
			selection: (cx, changes) => GardSelection.near(cx, changes.mapPos(to, 1)),
		});
		this.state = tr.state;
		this.lastInsert = insert.at(-1);
	}

	isEmpty() {
		return this.state.doc.length <= 2;
	}
}
