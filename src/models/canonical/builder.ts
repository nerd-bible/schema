import { GardState } from "wordgard/state";
import { Leaf, Mark, Plot, Node, Token, ChangeSet } from "wordgard/doc";
import type { Meta, RichText } from "./richText.ts";

function tokenToNode(t: Exclude<Token, typeof Plot.End> | string): Node {
	if (typeof t === "string") return Leaf.text(t, []);
	if (t.tokenType == Token.Type.Open) return t.create([]);
	return t;
}

type Mutable<Type> = {
	-readonly [Key in keyof Type]: Type[Key];
};

interface Change extends Omit<ChangeSet.Change, "insert"> {
	insert: (Node | typeof Plot.End)[];
}

export interface MutableJson extends Node.JSON {
	content?: MutableJson[];
}

type ModificationJSON =
	| {
			add: string;
			value: any;
	  }
	| {
			remove: string;
			value: any;
	  };
type MutableChangeSetJson =
	| number
	| [number, (MutableJson | ".")[] | ModificationJSON[]];

/// Build a `Plot.Doc` by pushing to it.
export class Builder {
	meta: Meta;

	// https://code.haverbeke.berlin/wordgard/wordgard/issues/119
	// I originally used `GardState`, but its immutable API was 30x slower due to
	// array copying and GC
	doc: Plot.Doc;
	stack: Plot[] = [];
	lastInsert: Node;
	activeMarks: Mark.Set = [];

	layers: Record<string, Change[]> = {};

	constructor(config: GardState.Extension, meta: Meta) {
		const resolved = GardState.Configuration.create(config);
		this.doc = this.lastInsert = resolved.schema!.doc([]);
		this.meta = meta;
	}

	finish(validate = true): RichText {
		if (validate) this.doc.schema.validate(this.doc);

		return {
			type: "richText",
			schema: 1,
			meta: this.meta,
			content: this.doc.toJSON() as MutableJson,
			layers: Object.entries(this.layers).map(([k, v]) => ({
				name: k,
				style: {},
				changeset: v.map(
					(c) => ChangeSet.create(this.doc, c).toJSON() as MutableChangeSetJson,
				),
			})),
		};
	}

	get parent() {
		return this.stack.at(-1) ?? this.doc;
	}

	push(...tokens: (Token | string)[]): number {
		const start = this.cursor;
		for (const t of tokens) {
			if (t == Plot.End) {
				this.stack.pop();
				continue;
			}

			const parent = this.parent;
			const node = tokenToNode(t as Exclude<Token, typeof Plot.End>).withMarks(
				this.activeMarks,
			);

			// workaround WordGard.Node.create(content = [])
			if (parent.content.length == 0) (parent.content as Node[]) = [];

			if (
				this.lastInsert.isText &&
				node.isText &&
				Mark.sameSet(this.lastInsert.marks, node.marks)
			) {
				// optimize text concatenation
				(this.lastInsert as Mutable<Leaf<string>>).param += node.param;
			} else {
				(parent.content as Node[]).push(node);
				this.lastInsert = node;
			}

			// update contentLength ourselves
			for (const s of this.stack) s.contentLength += node.length;
			this.doc.contentLength += node.length;

			if (node.isPlot) this.stack.push(node);
		}
		return this.cursor - start;
	}

	pushLayer(name: string, ...tokens: (Token | string)[]) {
		const layer = (this.layers[name] ??= []);
		const start = this.cursor;
		if (tokens[0] == Plot.End && !this.stack.length) tokens = tokens.slice(1);

		for (const t of tokens) {
			const last = layer.at(-1);
			const lastInsert = last?.insert?.at(-1);

			const insert =
				t == Plot.End ? t : tokenToNode(t as Exclude<Token, typeof Plot.End>);
			if (
				lastInsert?.tokenType == Token.Type.Node &&
				lastInsert?.isText &&
				insert?.tokenType == Token.Type.Node &&
				insert?.isText
			) {
				// optimize text concatenation
				(this.lastInsert as Mutable<Leaf<string>>).param += insert.param;
			} else if (last?.from == start) {
				// optimize same start
				last.insert.push(insert ?? Plot.End);
			} else {
				layer.push({ from: start, insert: [insert] });
			}
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

	isInsertValid(n: Node.Type) {
		return this.schema.canContain(this.parent.type, n);
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
