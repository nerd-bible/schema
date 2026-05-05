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
	root = new Internal<K, V>([new Leaf<K, V>()], []);
	#size = 0;

	indexOf: (
		ctx: Leaf<K, V> | Internal<K, V>,
		key: K,
		failXor: number,
	) => number;
	maxNodeSize: number;
	splitNodeSize: number;
	minNodeSize: number;

	constructor(
		indexOf = (ctx: Leaf<K, V> | Internal<K, V>, key: K, failXor: number) =>
			binarySearch(ctx.keys, key, comparator, failXor),
		maxNodeSize = 32,
		splitNodeSize = Math.floor(maxNodeSize * 0.8),
	) {
		this.indexOf = indexOf;
		this.maxNodeSize = maxNodeSize;
		this.splitNodeSize = splitNodeSize;
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

abstract class Node<K extends Comparable, V extends Length> {
	values: (Internal<K, V> | Leaf<K, V>)[] | V[];
	keys: K[];
	length: number;

	constructor(
		values: (Internal<K, V> | Leaf<K, V>)[] | V[],
		keys: K[],
		length: number,
	) {
		this.values = values;
		this.keys = keys;
		this.length = length;
	}

	get size(): number {
		return this.values.length;
	}

	abstract minKey(): K;
	maxKey(): K {
		return this.keys[this.keys.length - 1];
	}

	splitRight(idx: number): this {
		const keys = this.keys.splice(idx);
		const values = this.values.splice(idx);
		const res = new (this.constructor as any)(values, keys);
		this.length -= res.length;
		return res;
	}

	trySplitRight(tree: BTree<K, V>): undefined | this {
		if (this.size > tree.maxNodeSize)
			return this.splitRight(tree.splitNodeSize);
	}

	getPos(pos: number): { key: K; value: V; offset: number } | undefined {
		if (pos > this.length) return;
		for (let i = 0; i < this.size; i++) {
			const value = this.values[i];
			if (pos - value.length < 0) {
				const value = this.values[i];
				if (value instanceof Internal || value instanceof Leaf)
					return value.getPos(pos);
				return { key: this.keys[i], value, offset: pos };
			}
			pos -= value.length;
		}
	}
}

export class Internal<K extends Comparable, V extends Length> extends Node<
	K,
	V
> {
	declare values: (Internal<K, V> | Leaf<K, V>)[];

	constructor(
		values: Internal<K, V>[] | Leaf<K, V>[],
		keys: K[] = values.map((c) => c.maxKey()),
		length = values.reduce((acc, c) => acc + c.length, 0),
	) {
		super(values, keys, length);
	}

	minKey(): K {
		return this.values[0].minKey();
	}

	get(key: K, tree: BTree<K, V>): V | undefined {
		const idx = tree.indexOf(this, key, 0);
		return this.values[idx].get(key, tree);
	}

	set(key: K, value: V, tree: BTree<K, V>): undefined | Internal<K, V> {
		let idx = tree.indexOf(this, key, 0);
		idx = Math.min(idx, this.values.length - 1);
		const child = this.values[idx];

		const result = child.set(key, value, tree);
		this.keys[idx] = child.maxKey();
		this.length += value.length;
		if (!result) return;

		this.values.splice(idx + 1, 0, result);
		this.keys.splice(idx + 1, 0, result.maxKey());
		const res = this.trySplitRight(tree);
		if (res) this.length -= res.length;
		return res;
	}

	delete(key: K, tree: BTree<K, V>): number {
		const idx = tree.indexOf(this, key, 0);
		if (idx === -1) return 0;

		const child = this.values[idx];
		const result = child.delete(key, tree);
		if (result) {
			this.length -= result;
			this.keys[idx] = child.maxKey();
			if (child.size < tree.minNodeSize)
				this.tryMergeLeft(idx, tree) || this.tryMergeLeft(idx + 1, tree);
		}

		return result;
	}

	tryMergeLeft(idx: number, tree: BTree<K, V>): boolean {
		const child = this.values[idx];
		const left = this.values[idx - 1];
		if (child && left?.size <= tree.minNodeSize) {
			// Merge `child` into `left` and then remove it from `this`
			let same = false;
			if (left instanceof Leaf && child instanceof Leaf) {
				left.values.push(...child.values);
				same = true;
			} else if (left instanceof Internal && child instanceof Internal) {
				left.values.push(...child.values);
				same = true;
			}
			if (same) {
				left.keys.push(...child.keys);
				left.length += child.length;
				this.values.splice(idx, 1);
				this.keys.splice(idx - 1, 1);
				return true;
			}
		}
		return false;
	}

	*items(low: K, high: K, tree: BTree<K, V>): NodeGenerator<K, V> {
		const start = tree.indexOf(this, low, 0);
		const end = tree.indexOf(this, high, 0);
		for (let i = start; i <= end && i < this.size; i++)
			yield* this.values[i].items(low, high, tree);
	}
}

export class Leaf<K extends Comparable, V extends Length> extends Node<K, V> {
	declare values: V[];

	constructor(
		values: V[] = [],
		keys: K[] = [],
		length = values.reduce((acc, c) => acc + c.length, 0),
	) {
		super(values, keys, length);
	}

	minKey(): K {
		return this.keys[0];
	}

	get(key: K, tree: BTree<K, V>): V | undefined {
		const idx = tree.indexOf(this, key, -1);
		return this.values[idx];
	}

	set(key: K, value: V, tree: BTree<K, V>): undefined | Leaf<K, V> {
		const idx = tree.indexOf(this, key, 0);

		this.keys.splice(idx, 0, key);
		this.values.splice(idx, 0, value);
		this.length += value.length;
		return this.trySplitRight(tree);
	}

	delete(key: K, tree: BTree<K, V>): number {
		const idx = tree.indexOf(this, key, -1);
		if (idx !== -1) {
			this.keys.splice(idx, 1);
			const res = this.values[idx].length;
			this.length -= res;
			this.values.splice(idx, 1);
			return res;
		}
		return 0;
	}

	*items(low: K, high: K, tree: BTree<K, V>): NodeGenerator<K, V> {
		const start = tree.indexOf(this, low, 0);
		const end = Math.min(this.keys.length - 1, tree.indexOf(this, high, 0));
		yield { node: this, start, end };
	}
}
