import { Leaf, Mark, Plot, Node, Token, ChangeSet, Schema } from "wordgard/doc";
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
	insert: (Node | Plot.Tag)[];
}

abstract class BuilderBase {
	// https://code.haverbeke.berlin/wordgard/wordgard/issues/119
	// I originally used `GardState`, but its immutable API was 30x slower due to
	// array copying and GC
	schema: Schema;
	stack: Plot[] = [];
	lastInsert: Node;
	activeMarks: Mark.Set = [];

	constructor(schema: Schema) {
		this.schema = schema;

		if (schema.docTag.type.canBeEmpty) {
			this.lastInsert = schema.doc([]);
		} else {
			const defaultContent = schema.createAndFill(
				schema.defaultContentTag(schema.docTag.type)!,
			);
			if (defaultContent.isPlot) this.stack.push(defaultContent);
			this.lastInsert = schema.doc([defaultContent]);
		}
	}

	abstract pushNode(n: Node): void;

	push(...tokens: (Token | string)[]): number {
		let res = 0;

		for (const t of tokens) {
			if (t == Plot.End) {
				this.stack.pop();
				continue;
			}

			const node = tokenToNode(t as Exclude<Token, typeof Plot.End>).withMarks(
				this.activeMarks,
			);

			if (
				this.lastInsert.isText &&
				node.isText &&
				Mark.sameSet(this.lastInsert.marks, node.marks)
			) {
				// optimize text concatenation
				(this.lastInsert as Mutable<Leaf<string>>).param += node.param;
			} else {
				this.pushNode(node);
				this.lastInsert = node;
			}

			// update contentLength ourselves
			for (const s of this.stack) s.contentLength += node.length;
			res += node.length;

			if (node.isPlot) this.stack.push(node);
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

/// Build a `Plot.Doc` by pushing to it.
export class Builder<Layer extends string> extends BuilderBase {
	doc: Plot.Doc;
	meta: Meta;
	layers: { [L in Layer]: LayerBuilder };

	constructor(schema: Schema, meta: Meta, layers: readonly Layer[] = []) {
		super(schema);
		this.doc = this.lastInsert as Plot.Doc;
		const lastContent = this.doc.content.at(-1);
		if (lastContent) this.lastInsert = lastContent;
		this.meta = meta;
		this.layers = {} as any;
		for (const l of layers)
			this.layers[l] = new LayerBuilder(this.doc.schema, this);
	}

	pushNode(n: Node) {
		const parent = this.stack.at(-1) ?? this.doc;
		// workaround WordGard.Node.create(content = [])
		if (parent.content.length == 0) (parent.content as Node[]) = [];
		(parent.content as Node[]).push(n);
	}

	push(...tokens: (Token | string)[]): number {
		const res = super.push(...tokens);
		this.doc.contentLength += res;
		return res;
	}

	isEmpty() {
		return this.doc.length <= 2;
	}

	get pos() {
		return this.doc.length - this.stack.length;
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

	finish(validate = true): RichText {
		if (validate) this.doc.schema.validate(this.doc);

		const content = this.doc.toJSON() as RichText["content"];
		const layers = (Object.keys(this.layers) as Layer[]).reduce(
			(acc, k) => {
				acc[k] = this.layers[k].finish(this.doc);
				return acc;
			},
			{} as RichText["layers"],
		);

		return {
			type: "richText",
			schema: 1,
			meta: this.meta,
			content,
			layers,
		};
	}
}

type Layer = RichText["layers"][string];

export class LayerBuilder extends BuilderBase {
	changes: Change[] = [];
	provider: { get pos(): number };
	lastPos: number;

	constructor(schema: Schema, provider: { get pos(): number }) {
		super(schema);
		this.provider = provider;
		this.lastPos = provider.pos;
	}

	get pos() {
		return this.provider.pos;
	}

	pushNode(n: Node) {
		const from = n.isBlock && this.pos == 1 ? 0 : this.pos;
		let insert: (Node | Plot.Tag)[] = [n];
		// This makes WordGard move the content from the existing plot instead of
		// make a new empty one.
		// TODO: make an API where the user knows the difference
		if (n.isPlot && n.content.length == 0) insert = [n.tag];
		this.changes.push({ from, insert });
	}

	push(...tokens: (Token | string)[]): number {
		let { pos, lastPos } = this;
		if (pos > lastPos + 1) this.stack = [];
		const res = super.push(...tokens);
		this.lastPos = pos + res;

		return res;
	}

	finish(d: Plot.Doc, validate = false): Layer {
		let changeset = ChangeSet.create(d, this.changes);
		if (validate) changeset = changeset.correct(d);

		return changeset.toJSON() as Layer;
	}
}
