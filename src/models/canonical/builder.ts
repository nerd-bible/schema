import { GardSelection, GardState } from "wordgard/state";
import type { Meta } from "./meta.ts";
import * as z from "zod";
import type { SourceMap } from "./sourceMap";
import type { Node, Token } from "wordgard/doc";

export type Doc = {
	type: "doc";
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

	constructor(
		config: GardState.Extension | GardState.Configuration,
		meta: Meta,
	) {
		this.state = GardState.create({ config });
		console.log("nice?", this.state.schema);
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

	insert(...tokens: Token[]) {
		const { from, to } = this.state.selection.replacementRange;
		const tr = this.state.update({
			changes: {
				from,
				to,
				insert: tokens,
				fit: true,
			},
			selection: (_cx, changes) => GardSelection.cursor(changes.mapPos(to, 1)),
		});
		this.state = tr.state;
	}

	isEmpty() {
		return this.state.doc.length != 0;
	}
}
