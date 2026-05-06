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

abstract class Node<K extends Comparable, V extends Length> {
	_values: (Internal<K, V> | Leaf<K, V>)[] | V[];
	_keys: K[];
	_length: number;

	constructor(
		values: (Internal<K, V> | Leaf<K, V>)[] | V[],
		keys: K[],
		length: number,
	) {
		this._values = values;
		this._keys = keys;
		this._length = length;
	}

	get length(): number {
		return this._length;
	}

	abstract get size(): number;
	abstract minKey(): K;
	maxKey(): K {
		return this._keys[this._keys.length - 1];
	}

	splitRight(idx: number): this {
		const values = this._values.splice(idx);
		const keys = this._keys.splice(idx);
		const res = new ((this instanceof Internal ? Internal : Leaf) as any)(
			values,
			keys,
		);
		this._length -= res.length;
		return res;
	}

	trySplitRight(tree: BTree<K, V>): undefined | this {
		if (this._values.length > tree.maxNodeSize)
			return this.splitRight(tree.splitNodeSize);
	}

	getPos(pos: number): { key: K; value: V; offset: number } | undefined {
		if (pos > this.length) return;
		for (let i = 0; i < this._values.length; i++) {
			const value = this._values[i];
			if (pos - value.length < 0) {
				const value = this._values[i];
				if (value instanceof Internal || value instanceof Leaf)
					return value.getPos(pos);
				return { key: this._keys[i], value, offset: pos };
			}
			pos -= value.length;
		}
	}
}

export class Leaf<K extends Comparable, V extends Length> extends Node<K, V> {
	declare _values: V[];

	constructor(
		values: V[] = [],
		keys: K[] = [],
		length = values.reduce((acc, c) => acc + c.length, 0),
	) {
		super(values, keys, length);
	}

	get size(): number {
		return this._values.length;
	}

	minKey(): K {
		return this._keys[0];
	}

	get(key: K, tree: BTree<K, V>): V | undefined {
		const idx = tree.indexOf(this, key, -1);
		return this._values[idx];
	}

	set(key: K, value: V, tree: BTree<K, V>): Leaf<K, V> | void {
		const idx = tree.indexOf(this, key, 0);

		this._keys.splice(idx, 0, key);
		this._values.splice(idx, 0, value);
		this._length += value.length;
		return this.trySplitRight(tree);
	}

	delete(key: K, tree: BTree<K, V>): number {
		const idx = tree.indexOf(this, key, -1);
		if (idx !== -1) {
			this._keys.splice(idx, 1);
			const res = this._values[idx].length;
			this._length -= res;
			this._values.splice(idx, 1);
			return res;
		}
		return 0;
	}

	*items(low: K, high: K, tree: BTree<K, V>): NodeGenerator<K, V> {
		const start = tree.indexOf(this, low, 0);
		const end = Math.min(this._keys.length - 1, tree.indexOf(this, high, 0));
		yield { node: this, start, end };
	}
}

export class Internal<K extends Comparable, V extends Length> extends Node<
	K,
	V
> {
	declare _values: (Internal<K, V> | Leaf<K, V>)[];
	_size = 0;

	constructor(
		values: (Internal<K, V> | Leaf<K, V>)[],
		keys: K[] = values.map((c) => c.maxKey()),
		length = values.reduce((acc, c) => acc + c.length, 0),
	) {
		super(values, keys, length);
		this._size = values.reduce((acc, c) => acc + c.size, 0);
	}

	get size(): number {
		return this._size;
	}

	minKey(): K {
		return this._values[0].minKey();
	}

	get(key: K, tree: BTree<K, V>): V | undefined {
		const idx = tree.indexOf(this, key, 0);
		return this._values[idx].get(key, tree);
	}

	set(key: K, value: V, tree: BTree<K, V>): Internal<K, V> | void {
		let idx = tree.indexOf(this, key, 0);
		idx = Math.min(idx, this._values.length - 1);
		const child = this._values[idx];

		const result = child.set(key, value, tree);
		this._keys[idx] = child.maxKey();
		this._length += value.length;
		this._size += 1;
		if (!result) return;

		this._values.splice(idx + 1, 0, result);
		this._keys.splice(idx + 1, 0, result.maxKey());
		return this.trySplitRight(tree);
	}

	delete(key: K, tree: BTree<K, V>): number {
		const idx = tree.indexOf(this, key, 0);
		if (idx === -1) return 0;

		const child = this._values[idx];
		const result = child.delete(key, tree);
		if (result) {
			this._length -= result;
			this._size -= 1;
			this._keys[idx] = child.maxKey();
			if (child._values.length < tree.minNodeSize)
				this.tryMergeLeft(idx, tree) || this.tryMergeLeft(idx + 1, tree);
		}

		return result;
	}

	tryMergeLeft(idx: number, tree: BTree<K, V>): boolean {
		const child = this._values[idx];
		const left = this._values[idx - 1];
		if (child && left?._values.length <= tree.minNodeSize) {
			// Merge `child` into `left` and then remove it from `this`
			let same = false;
			if (left instanceof Leaf && child instanceof Leaf) {
				left._values.push(...child._values);
				same = true;
			} else if (left instanceof Internal && child instanceof Internal) {
				left._values.push(...child._values);
				left._size += child._size;
				same = true;
			}
			if (same) {
				left._keys.push(...child._keys);
				left._length += child.length;
				this._values.splice(idx, 1);
				this._keys.splice(idx - 1, 1);
				return true;
			}
		}
		return false;
	}

	*items(low: K, high: K, tree: BTree<K, V>): NodeGenerator<K, V> {
		const start = tree.indexOf(this, low, 0);
		const end = tree.indexOf(this, high, 0);
		for (let i = start; i <= end && i < this._values.length; i++)
			yield* this._values[i].items(low, high, tree);
	}
}

export class BTree<K extends Comparable, V extends Length> extends Internal<
	K,
	V
> {
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
			binarySearch(ctx._keys, key, comparator, failXor),
		maxNodeSize = 32,
		splitNodeSize = Math.floor(maxNodeSize * 0.8),
	) {
		super([new Leaf<K, V>()]);
		this.indexOf = indexOf;
		this.maxNodeSize = maxNodeSize;
		this.splitNodeSize = splitNodeSize;
		this.minNodeSize = maxNodeSize << 1;
	}

	// TODO: bulk loading
	// static bulkLoad(): BTree {
	// }

	get(key: K): V | undefined {
		return super.get(key, this);
	}

	set(key: K, value: V): void {
		const res = super.set(key, value, this);
		if (res) {
			const old = new Internal<K, V>(this._values, this._keys, this.length);
			this._values = [old, res];
			this._keys = [old.maxKey(), res.maxKey()];
			this._length = old.length + res.length;
			this._size = old.size + res.size;
		}
	}

	delete(key: K): number {
		return super.delete(key, this);
	}

	*items(low = this.minKey(), high = this.maxKey()): NodeGenerator<K, V> {
		if (low != null && high != null) yield* super.items(low, high, this);
	}

	*keys(low = this.minKey(), high = this.maxKey()): Generator<K> {
		for (const { node, start, end } of this.items(low, high)) {
			for (let i = start; i <= end; i++) yield node._keys[i];
		}
	}

	*values(low = this.minKey(), high = this.maxKey()): Generator<V> {
		for (const { node, start, end } of this.items(low, high)) {
			for (let i = start; i <= end; i++) yield node._values[i];
		}
	}
}
