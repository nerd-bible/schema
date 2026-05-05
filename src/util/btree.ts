import { assert } from "./assert.ts";
import { binarySearch } from "./bsearch.ts";

type Comparable = number | bigint | Date | string;
type Length = {
	readonly length: number;
};
const comparator = (a: Comparable, b: Comparable) => {
	if (a > b) return 1;
	if (b > a) return -1;
	return 0;
};
type NodeGenerator<K extends Comparable, V extends Length> = Generator<{
	node: Leaf<K, V>;
	start: number;
	end: number;
}>;

export class BTree<K extends Comparable, V extends Length> {
	root = new Internal<K, V>([new Leaf()], []);
	#size = 0;

	indexOf: (
		ctx: Leaf<K, V> | Internal<K, V>,
		key: K,
		failXor: number,
	) => number;
	maxNodeSize: number;
	minNodeSize: number;

	constructor(
		indexOf = (ctx: Leaf<K, V> | Internal<K, V>, key: K, failXor: number) =>
			binarySearch(ctx.keys, key, comparator, failXor),
		maxNodeSize = 32,
	) {
		this.indexOf = indexOf;
		this.maxNodeSize = maxNodeSize;
		this.minNodeSize = maxNodeSize << 1;
	}

	// TODO: bulk loading
	// static bulkLoad(): BTree {
	// }

	get size(): number {
		return this.#size;
	}

	get length(): number {
		return this.root.length;
	}

	minKey(): K | undefined {
		return this.root.minKey();
	}

	maxKey(): K | undefined {
		return this.root.maxKey();
	}

	get(key: K): V | undefined {
		return this.root.get(key, this);
	}

	getPos(pos: number): { value: V; offset: number } | undefined {
		return this.root.getPos(pos);
	}

	set(key: K, value: V): void {
		const split = this.root.set(key, value, this);
		if (split) this.root = new Internal<K, V>([this.root, split]);
		this.#size++;
	}

	delete(key: K): number {
		const res = this.root.delete(key, this) ?? false;
		if (res) this.#size--;
		return res;
	}

	*items(low = this.minKey(), high = this.maxKey()): NodeGenerator<K, V> {
		if (low != null && high != null) yield* this.root.items(low, high, this);
	}

	*keys(low = this.minKey(), high = this.maxKey()): Generator<K> {
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

export class Internal<K extends Comparable, V extends Length> {
	children: (Internal<K, V> | Leaf<K, V>)[];
	keys: K[];
	length: number;

	constructor(
		children: (Internal<K, V> | Leaf<K, V>)[],
		keys = children.map((c) => c.maxKey()),
		length = children.reduce((acc, c) => acc + c.length, 0),
	) {
		this.children = children;
		this.keys = keys;
		this.length = length;
	}

	get size(): number {
		return this.children.length;
	}

	minKey(): K {
		return this.children[0].minKey();
	}

	maxKey(): K {
		return this.keys[this.keys.length - 1];
	}

	get(key: K, tree: BTree<K, V>): V | undefined {
		const idx = tree.indexOf(this, key, 0);
		return this.children[idx].get(key, tree);
	}

	getPos(pos: number): { key: K; value: V; offset: number } | undefined {
		if (pos > this.length) return;
		for (let i = 0; i < this.size; i++) {
			const child = this.children[i];
			if (pos - child.length < 0) return child.getPos(pos);
			pos -= child.length;
		}
	}

	set(key: K, value: V, tree: BTree<K, V>): undefined | Internal<K, V> {
		let idx = tree.indexOf(this, key, 0);
		idx = Math.min(idx, this.children.length - 1);
		const child = this.children[idx];

		const result = child.set(key, value, tree);
		this.keys[idx] = child.maxKey();
		this.length += value.length;
		if (!result) return;

		this.insertChild(idx + 1, result);
		const res = this.maybeSplit(tree);
		if (res) this.length -= res.length;
		return res;
	}

	delete(key: K, tree: BTree<K, V>): number {
		const idx = tree.indexOf(this, key, 0);
		if (idx === -1) return 0;

		const child = this.children[idx];
		const result = child.delete(key, tree);
		if (result) {
			this.length -= result;
			this.keys[idx] = child.maxKey();
			if (child.size < tree.minNodeSize) {
				this.tryMergeLeft(idx, tree) || this.tryMergeLeft(idx + 1, tree);
			}
		}

		return result;
	}

	tryMergeLeft(idx: number, tree: BTree<K, V>): boolean {
		const child = this.children[idx];
		const left = this.children[idx - 1];
		if (child && left?.size <= tree.minNodeSize) {
			// Merge `child` into `left` and then remove it from `this`
			left.keys.push(...child.keys);
			if (left instanceof Leaf) {
				left.values.push(...(child as Leaf<K, V>).values);
			} else {
				left.children.push(...(child as Internal<K, V>).children);
			}
			this.children.splice(idx, 1);
			this.keys.splice(idx - 1, 1);
			left.length += child.length;
			return true;
		}
		return false;
	}

	maybeSplit(tree: BTree<K, V>): undefined | Internal<K, V> {
		if (this.size > tree.maxNodeSize) {
			const idx = tree.maxNodeSize >> 1;
			const res = new Internal(this.children.splice(idx), this.keys.splice(idx));
			this.length -= res.length;
			return res;
		}
	}

	insertChild(i: number, child: Internal<K, V> | Leaf<K, V>) {
		this.children.splice(i, 0, child);
		this.keys.splice(i, 0, child.maxKey());
	}

	*items(low: K, high: K, tree: BTree<K, V>): NodeGenerator<K, V> {
		const start = tree.indexOf(this, low, 0);
		const end = tree.indexOf(this, high, 0);
		for (let i = start; i <= end && i < this.size; i++)
			yield* this.children[i].items(low, high, tree);
	}
}

export class Leaf<K extends Comparable, V extends Length> {
	keys: K[];
	values: V[];
	length: number;

	constructor(
		keys: K[] = [],
		values: V[] = [],
		length = values.reduce((acc, cur) => acc + cur.length, 0),
	) {
		this.keys = keys;
		this.values = values;
		this.length = length;
	}

	get size(): number {
		return this.values.length;
	}

	minKey(): K {
		return this.keys[0];
	}

	maxKey(): K {
		return this.keys[this.keys.length - 1];
	}

	get(key: K, tree: BTree<K, V>): V | undefined {
		const idx = tree.indexOf(this, key, -1);
		return this.values[idx];
	}

	getPos(pos: number): { key: K; value: V; offset: number } | undefined {
		if (pos > this.length) return;
		for (let i = 0; i < this.size; i++) {
			const l = this.values[i].length;
			if (pos - l < 0)
				return { key: this.keys[i], value: this.values[i], offset: pos };
			pos -= l;
		}
	}

	set(key: K, value: V, tree: BTree<K, V>): undefined | Leaf<K, V> {
		const idx = tree.indexOf(this, key, 0);

		this.keys.splice(idx, 0, key);
		this.values.splice(idx, 0, value);
		this.length += value.length;
		return this.maybeSplit(tree);
	}

	delete(key: K, tree: BTree<K, V>): number {
		const idx = tree.indexOf(this, key, -1);
		if (idx !== -1) {
			this.keys.splice(idx, 1);
			const res = this.values[idx].length;
			this.length -= res
			this.values.splice(idx, 1);
			return res;
		}
		return 0;
	}

	maybeSplit(tree: BTree<K, V>): undefined | Leaf<K, V> {
		if (this.size > tree.maxNodeSize) {
			const idx = tree.maxNodeSize >> 1;
			const keys = this.keys.splice(idx);
			const values = this.values.splice(idx);
			const res = new Leaf<K, V>(keys, values);
			this.length -= res.length;
			return res;
		}
	}

	*items(low: K, high: K, tree: BTree<K, V>): NodeGenerator<K, V> {
		const start = tree.indexOf(this, low, 0);
		const end = Math.min(this.keys.length - 1, tree.indexOf(this, high, 0));
		yield { node: this, start, end };
	}
}
