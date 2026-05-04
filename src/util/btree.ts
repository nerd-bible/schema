import { assert } from "./assert.ts";
import { binarySearch } from "./bsearch.ts";

type NodeGenerator<V> = Generator<{
	node: Leaf<V>;
	start: number;
	end: number;
}>;
const comparator = (a: number, b: number) => a - b;

export class BTree<V> {
	root?: Leaf<V> | Internal<V>;
	#size = 0;

	indexOf: (ctx: Leaf<V> | Internal<V>, key: number, failXor: number) => number;
	maxNodeSize: number;

	constructor(
		indexOf = (ctx: Leaf<V> | Internal<V>, key: number, failXor: number) =>
			binarySearch(ctx.keys, key, comparator, failXor),
		maxNodeSize = 32,
	) {
		this.indexOf = indexOf;
		this.maxNodeSize = maxNodeSize;
	}

	get size(): number {
		return this.#size;
	}

	minKey(): number | undefined {
		return this.root?.minKey();
	}

	maxKey(): number | undefined {
		return this.root?.maxKey();
	}

	get(key: number): V | undefined {
		return this.root?.get(key, this);
	}

	set(key: number, value: V): void {
		if (!this.root) {
			this.root = new Leaf<V>();
			// this.#depth++;
		}
		const split = this.root.set(key, value, this);
		if (split) {
			this.root = new Internal<V>([this.root, split]);
			// this.#depth++;
		}
		this.#size++;
	}

	delete(key: number): boolean {
		const res = this.root?.delete(key, this) ?? false;
		if (res) this.#size--;
		return res;
	}

	*items(low = this.minKey(), high = this.maxKey()): NodeGenerator<V> {
		if (low !== undefined && high !== undefined && this.root)
			yield* this.root.items(low, high, this);
	}

	*keys(low = this.minKey(), high = this.maxKey()): Generator<number> {
		for (const { node, start, end } of this.items(low, high)) {
			for (let i = start; i <= end; i++) yield node.keys[i];
		}
	}

	*values(low = this.minKey(), high = this.maxKey()): Generator<V> {
		for (const { node, start, end } of this.items(low, high)) {
			for (let i = start; i <= end; i++) yield node.values[i];
		}
	}
}

export class Leaf<V> {
	keys: number[];
	values: V[];

	constructor(keys: number[] = [], values: V[] = []) {
		this.keys = keys;
		this.values = values;
	}

	get size(): number {
		return this.keys.length;
	}

	minKey(): number {
		return this.keys[0];
	}

	maxKey(): number {
		return this.keys[this.keys.length - 1];
	}

	get(key: number, tree: BTree<V>): V | undefined {
		const idx = tree.indexOf(this, key, -1);
		return this.values[idx];
	}

	set(key: number, value: V, tree: BTree<V>): undefined | Leaf<V> {
		const idx = tree.indexOf(this, key, 0);

		this.keys.splice(idx, 0, key);
		this.values.splice(idx, 0, value);
		return this.maybeSplit(tree);
	}

	delete(key: number, tree: BTree<V>): boolean {
		const idx = tree.indexOf(this, key, -1);
		if (idx !== -1) {
			this.keys.splice(idx, 1);
			this.values.splice(idx, 1);
			return true;
		}
		return false;
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

	*items(low: number, high: number, tree: BTree<V>): NodeGenerator<V> {
		const start = tree.indexOf(this, low, 0);
		const end = Math.min(this.keys.length - 1, tree.indexOf(this, high, 0));
		yield { node: this, start, end };
	}
}

export class Internal<V> {
	children: (Internal<V> | Leaf<V>)[];
	keys: number[];

	constructor(
		children: (Internal<V> | Leaf<V>)[],
		keys: number[] = children.map((c) => c.maxKey()),
	) {
		this.children = children;
		this.keys = keys;
	}

	get size(): number {
		return this.children.length;
	}

	minKey(): number {
		return this.children[0].minKey();
	}

	maxKey(): number {
		return this.keys[this.keys.length - 1];
	}

	get(key: number, tree: BTree<V>): V | undefined {
		const idx = tree.indexOf(this, key, 0);
		return this.children[idx].get(key, tree);
	}

	set(key: number, value: V, tree: BTree<V>): undefined | Internal<V> {
		let idx = tree.indexOf(this, key, 0);
		idx = Math.min(idx, this.children.length - 1);
		const child = this.children[idx];

		const result = child.set(key, value, tree);
		this.keys[idx] = child.maxKey();
		if (!result) return;

		this.insertChild(idx + 1, result);
		return this.maybeSplit(tree);
	}

	delete(key: number, tree: BTree<V>): boolean {
		const idx = tree.indexOf(this, key, 0);
		if (idx === -1) return false;

		const child = this.children[idx];
		const result = child.delete(key, tree);
		if (!result) return false;

		const minSize = tree.maxNodeSize >> 1;
		if (child.size < minSize) {
			this.tryBalanceLeft(idx, minSize) ||
				this.tryBalanceLeft(idx + 1, minSize);
		}
		return true;
	}

	tryBalanceLeft(idx: number, minSize: number): boolean {
		const child = this.children[idx];
		const left = this.children[idx - 1];
		if (!child || !left) return false;
		if (left.size > minSize) {
			const avg = (child.size + left.size) >> 1;
			const toTake = left.keys.splice(avg);
			child.keys.unshift(...toTake);

			if (left instanceof Leaf) {
				const toTakeValues = left.values.splice(avg);
				(child as Leaf<V>).values.unshift(...toTakeValues);
			} else {
				const toTakeChildren = left.children.splice(avg);
				(child as Internal<V>).children.unshift(...toTakeChildren);
			}

			return true;
		} else {
			left.keys.push(...child.keys);
			if (left instanceof Leaf) {
				left.values.push(...(child as Leaf<V>).values);
			} else {
				left.children.push(...(child as Internal<V>).children);
			}
			this.children.splice(idx, 1);
			return true;
		}
	}

	maybeSplit(tree: BTree<V>): undefined | Internal<V> {
		if (this.size > tree.maxNodeSize) {
			const idx = tree.maxNodeSize >> 1;
			return new Internal(this.children.splice(idx), this.keys.splice(idx));
		}
	}

	insertChild(i: number, child: Internal<V> | Leaf<V>) {
		this.children.splice(i, 0, child);
		this.keys.splice(i, 0, child.maxKey());
	}

	*items(low: number, high: number, tree: BTree<V>): NodeGenerator<V> {
		const start = tree.indexOf(this, low, 0);
		const end = tree.indexOf(this, high, 0);
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
	node: Internal<any> | Leaf<any>,
): string {
	let res = "";

	const id = `i${counter++}`;
	const min = JSON.stringify(node.minKey(), null, 2).replaceAll('"', '\\"');
	const max = JSON.stringify(node.maxKey(), null, 2).replaceAll('"', '\\"');
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
