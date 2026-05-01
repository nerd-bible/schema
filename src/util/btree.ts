import { assert } from "./assert.ts";
import { binarySearch } from "./bsearch.ts";

export interface NodeI<V> {
	get size(): number;
	keys: bigint[];

	min(): bigint;
	max(): bigint;
	get(key: bigint, tree: BTree<V>): V | undefined;
	set(key: bigint, value: V, tree: BTree<V>): NodeI<V> | undefined;
	items(low: bigint, high: bigint, tree: BTree<V>): NodeGenerator<V>;
}

type NodeGenerator<V> = Generator<{
	node: Leaf<V>;
	start: number;
	end: number;
}>;
const comparator = (a: bigint, b: bigint) => a - b;

export class BTree<V> {
	root?: NodeI<V>;
	#size = 0;

	indexOf: (ctx: NodeI<V>, key: bigint) => number;
	maxNodeSize: number;

	constructor(
		indexOf = (ctx: NodeI<V>, key: bigint) => binarySearch(ctx.keys, key, comparator, 0),
		maxNodeSize = 1 << 8,
	) {
		this.indexOf = indexOf;
		this.maxNodeSize = maxNodeSize;
	}

	get size(): number {
		return this.#size;
	}

	min(): bigint | undefined {
		return this.root?.min();
	}

	max(): bigint | undefined {
		return this.root?.max();
	}

	get(key: bigint): V | undefined {
		return this.root?.get(key, this);
	}

	set(key: bigint, value: V): void {
		this.root ??= new Leaf<V>();
		const split = this.root.set(key, value, this);
		if (split) this.root = new Internal<V>([this.root, split]);
		this.#size++;
	}

	*nodes(low = this.min(), high = this.max()): NodeGenerator<V> {
		if (low !== undefined && high !== undefined && this.root)
			yield* this.root.items(low, high, this);
	}

	*keys(low = this.min(), high = this.max()): Generator<bigint> {
		for (const { node, start, end } of this.nodes(low, high)) {
			for (let i = start; i <= end; i++) yield node.keys[i];
		}
	}

	*values(low = this.min(), high = this.max()): Generator<V> {
		for (const { node, start, end } of this.nodes(low, high)) {
			for (let i = start; i <= end; i++) yield node.values[i];
		}
	}
}

export class Leaf<V> implements NodeI<V> {
	keys: bigint[];
	values: V[];

	constructor(keys: bigint[] = [], values: V[] = []) {
		this.keys = keys;
		this.values = values;
	}

	get size(): number {
		return this.keys.length;
	}

	min(): bigint {
		return this.keys[0];
	}

	max(): bigint {
		return this.keys[this.keys.length - 1];
	}

	get(key: bigint, tree: BTree<V>): V | undefined {
		const idx = tree.indexOf(this, key);
		return this.values[idx];
	}

	set(key: bigint, value: V, tree: BTree<V>): undefined | Leaf<V> {
		const idx = tree.indexOf(this, key);

		this.keys.splice(idx, 0, key);
		this.values.splice(idx, 0, value);
		return this.maybeSplit(tree);
	}

	maybeSplit(tree: BTree<V>): undefined | Leaf<V> {
		if (this.size > tree.maxNodeSize) {
			const idx = tree.maxNodeSize >> 1;
			const keys = this.keys.splice(idx);
			const values = this.values.splice(idx);
			// This type hack keeps Typescript happy
			return new Leaf<V>(keys, values);
		}
	}

	*items(low: bigint, high: bigint, tree: BTree<V>): NodeGenerator<V> {
		const start = tree.indexOf(this, low);
		const end = Math.min(this.keys.length - 1, tree.indexOf(this, high));
		yield { node: this, start, end };
	}
}

export class Internal<V> implements NodeI<V> {
	children: NodeI<V>[];
	keys: bigint[];

	constructor(children: NodeI<V>[], keys: bigint[] = children.map((c) => c.max())) {
		this.children = children;
		this.keys = keys;
	}

	get size(): number {
		return this.children.length;
	}

	min(): bigint {
		return this.children[0].min();
	}

	max(): bigint {
		return this.keys[this.keys.length - 1];
	}

	get(key: bigint, tree: BTree<V>): V | undefined {
		const idx = tree.indexOf(this, key);
		return this.children[idx].get(key, tree);
	}

	set(key: bigint, value: V, tree: BTree<V>): undefined | this {
		let idx = tree.indexOf(this, key);
		idx = Math.min(idx, this.children.length - 1);
		const child = this.children[idx];

		const result = child.set(key, value, tree);
		this.keys[idx] = child.max();
		if (!result) return;

		this.insertChild(idx + 1, result);
		return this.maybeSplit(tree);
	}

	maybeSplit(tree: BTree<V>): undefined | this {
		if (this.size > tree.maxNodeSize) {
			const idx = tree.maxNodeSize >> 1;
			return new Internal(
				this.children.splice(idx),
				this.keys.splice(idx),
			) as this;
		}
	}

	insertChild(i: number, child: NodeI<V>) {
		this.children.splice(i, 0, child);
		this.keys.splice(i, 0, child.max());
	}

	*items(low: bigint, high: bigint, tree: BTree<V>): NodeGenerator<V> {
		const start = tree.indexOf(this, low);
		const end = tree.indexOf(this, high);
		for (let i = start; i <= end && i < this.size; i++)
			yield* this.children[i].items(low, high, tree);
	}
}

/** Debug functions that may be tree-shaken. */
let counter = 0;
export function toDot(tree: BTree<any>): string {
	let res = "digraph {\n";
	if (tree.root) res += nodeToDot(tree, "", tree.root);
	res += "}";
	return res;
}

function nodeToDot(
	tree: BTree<any>,
	fromId: string,
	node: NodeI<any>,
): string {
	let res = "";

	const id = `i${counter++}`;
	const min = JSON.stringify(node.min(), null, 2).replaceAll('"', '\\"');
	const max = JSON.stringify(node.max(), null, 2).replaceAll('"', '\\"');
	res += `${id}[label="min: ${min}\nmax: ${max}\nsize: ${node.size}"]\n`;
	if (fromId) res += `${fromId} -> ${id}\n`;

	if (node instanceof Internal) {
		for (let i = 0; i < node.children.length; i++) {
			assert(node.children[i], `bad ${i}`);
			res += nodeToDot(tree, id, node.children[i]);
		}
	}

	return res;
}
