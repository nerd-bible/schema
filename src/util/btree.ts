import { binarySearch } from "./bsearch.ts";
import pc from "picocolors";

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

type Mark = {
	tag: string;
	attrs?: Record<string, string | number | boolean | null | undefined>;
};
function deepEqual<T>(a: T, b: T): boolean {
	if (a === b) return true;

	const bothAreObjects =
		a &&
		b &&
		typeof a === "object" &&
		typeof b === "object" &&
		Array.isArray(a) === Array.isArray(b);

	return Boolean(
		bothAreObjects &&
		Object.keys(a).length === Object.keys(b).length &&
		Object.entries(a).every(([k, v]) => deepEqual(v, b[k as keyof T])),
	);
}

abstract class Node<K extends Comparable, V extends Length> {
	_values: (Internal<K, V> | Leaf<K, V>)[] | V[];
	_keys: K[];
	_length: number;
	_marks: Mark[];

	constructor(
		values: (Internal<K, V> | Leaf<K, V>)[] | V[],
		keys: K[],
		length: number,
		marks: Mark[],
	) {
		this._values = values;
		this._keys = keys;
		this._length = length;
		this._marks = marks;
	}

	abstract clone(): Internal<K, V> | Leaf<K, V>;

	get length(): number {
		return this._length;
	}

	minKey(): K {
		return this._keys[0];
	}

	maxKey(): K {
		return this._keys[this._keys.length - 1];
	}

	splitRight(idx: number) {
		const right = this.clone();
		right._keys = this._keys.splice(idx);
		right._values = this._values.splice(idx);
		right._length = right._values.reduce((acc, c) => acc + c.length, 0);
		this._length -= right._length;
		return right;
	}

	trySplitRight(tree: BTree<K, V>): undefined | Internal<K, V> | Leaf<K, V> {
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
		marks: Mark[] = [],
	) {
		super(values, keys, length, marks);
	}

	clone() {
		return new Leaf(
			this._values.slice(),
			this._keys.slice(),
			this.length,
			this._marks.slice(),
		);
	}

	get(key: K, tree: BTree<K, V>): V | undefined {
		const idx = tree.indexOf(this, key, -1);
		return this._values[idx];
	}

	set(key: K, value: V, tree: BTree<K, V>): void {
		const idx = tree.indexOf(this, key, 0);
		this._keys.splice(idx, 0, key);
		this._values.splice(idx, 0, value);
		this._length += value.length;
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
		return -1;
	}

	*nodes(low: K, high: K, tree: BTree<K, V>): NodeGenerator<K, V> {
		let end = tree.indexOf(this, high, -1);
		if (end > 0) end++;
		else end ^= -1;
		yield { node: this, start: tree.indexOf(this, low, 0), end };
	}
}

export class Internal<K extends Comparable, V extends Length> extends Node<
	K,
	V
> {
	declare _values: (Internal<K, V> | Leaf<K, V>)[];

	constructor(
		values: (Internal<K, V> | Leaf<K, V>)[],
		keys: K[] = values.map((c) => c.maxKey()),
		length = values.reduce((acc, c) => acc + c.length, 0),
		marks: Mark[] = [],
	) {
		super(values, keys, length, marks);
	}

	clone() {
		return new Internal(
			this._values.slice(),
			this._keys.slice(),
			this.length,
			this._marks.slice(),
		);
	}

	minKey(): K {
		return this._values[0].minKey();
	}

	get(key: K, tree: BTree<K, V>): V | undefined {
		const idx = tree.indexOf(this, key, 0);
		return this._values[idx].get(key, tree);
	}

	set(key: K, value: V, tree: BTree<K, V>): void {
		const idx = Math.min(tree.indexOf(this, key, 0), this._values.length - 1);
		const child = this._values[idx];

		child.set(key, value, tree);
		this._keys[idx] = child.maxKey();
		this._length += value.length;

		const right = child.trySplitRight(tree);
		if (right) {
			this._keys[idx] = child.maxKey();
			this._values.splice(idx + 1, 0, right);
			this._keys.splice(idx + 1, 0, right.maxKey());
		}
	}

	delete(key: K, tree: BTree<K, V>): number {
		const idx = tree.indexOf(this, key, 0);
		if (idx === -1) return -1;

		const child = this._values[idx];
		const result = child.delete(key, tree);
		if (result != -1) {
			this._length -= result;
			this._keys[idx] = child.maxKey();
			if (this._keys[idx] == null) this._keys.splice(idx, 1);
			if (child._values.length < tree.minNodeSize)
				this.tryMergeLeft(idx, tree) || this.tryMergeLeft(idx + 1, tree);
		}

		return result;
	}

	mergeLeft(idx: number): boolean {
		if (idx === 0) return false;
		const child = this._values[idx];
		const left = this._values[idx - 1];
		// Merge `child` into `left` and then remove it from `this`
		let same = false;
		if (left instanceof Leaf && child instanceof Leaf) {
			left._values.push(...child._values);
			same = true;
		} else if (left instanceof Internal && child instanceof Internal) {
			left._values.push(...child._values);
			same = true;
		}
		if (same) {
			left._keys.push(...child._keys);
			left._length += child.length;
			this._values.splice(idx, 1);
			this._keys.splice(idx - 1, 1);
			return true;
		}
		return false;
	}

	tryMergeLeft(idx: number, tree: BTree<K, V>): boolean {
		const child = this._values[idx];
		const left = this._values[idx - 1];
		if (
			child &&
			left?._values.length <= tree.minNodeSize &&
			deepEqual(left._marks, child._marks)
		)
			return this.mergeLeft(idx);
		return false;
	}

	split(key: K, tree: BTree<K, V>): void {
		const idx = tree.indexOf(this, key, 0);
		const child = this._values[idx];
		if (child instanceof Leaf) {
			const idx2 = tree.indexOf(child, key, 0);
			if (idx2 > 0 && idx2 < child._values.length) {
				const split = child.splitRight(idx2);
				this._keys[idx] = child.maxKey();
				this._keys.splice(idx + 1, 0, split.maxKey());
				this._values.splice(idx + 1, 0, split);
				// this.mergeLeft(idx + 1);
			}
		} else child?.split(key, tree);
	}

	mark(low: K, high: K, mark: Mark, tree: BTree<K, V>) {
		this.split(low, tree);
		this.split(high, tree);
		// TODO: mark merger
		// TODO: try sibling node merger
		for (const n of this.nodes(low, high, tree)) n.node._marks.push(mark);
	}

	*nodes(low: K, high: K, tree: BTree<K, V>): NodeGenerator<K, V> {
		const start = tree.indexOf(this, low, 0);
		let end = tree.indexOf(this, high, -1);
		if (end > 0) end++;
		else end ^= -1;
		for (let i = start; i < end; i++)
			yield* this._values[i].nodes(low, high, tree);
	}
}

export class BTree<K extends Comparable, V extends Length> {
	indexOf: (
		ctx: Leaf<K, V> | Internal<K, V>,
		key: K,
		failXor: number,
	) => number;
	maxNodeSize: number;
	splitNodeSize: number;
	minNodeSize: number;
	root = new Internal<K, V>([new Leaf<K, V>()]);
	_size = 0;

	constructor(
		indexOf = (ctx: Leaf<K, V> | Internal<K, V>, key: K, failXor: number) =>
			binarySearch(ctx._keys, key, comparator, failXor),
		maxNodeSize = 64,
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

	get length(): number {
		return this.root.length;
	}

	get size(): number {
		return this._size;
	}

	minKey(): K {
		return this.root.minKey();
	}

	maxKey(): K {
		return this.root.maxKey();
	}

	get(key: K): V | undefined {
		return this.root.get(key, this);
	}

	getPos(pos: number): { key: K; value: V; offset: number } | undefined {
		return this.root.getPos(pos);
	}

	set(key: K, value: V): void {
		this.root.set(key, value, this);
		this._size += 1;
		const res = this.root.trySplitRight(this);
		if (res) {
			const old = this.root.clone();
			this.root._values = [old, res];
			this.root._keys = [old.maxKey(), res.maxKey()];
			this.root._length = old.length + res.length;
			this.root._marks = structuredClone(old._marks);
		}
	}

	/**
	 * Delete single occurence of `key`.
	 *
	 * @returns {number} deleted item length or -1
	 */
	delete(key: K): number {
		const res = this.root.delete(key, this);
		if (res !== -1) {
			this._size -= 1;
			if (
				this.root._values.length === 1 &&
				this.root._values[0] instanceof Internal
			)
				this.root = this.root._values[0];
		}
		return res;
	}

	split(key: K): void {
		return this.root.split(key, this);
	}

	mark(low: K, high: K, mark: Mark) {
		return this.root.mark(low, high, mark, this);
	}

	*keys(low = this.minKey(), high = this.maxKey()): Generator<K> {
		for (const { node, start, end } of this.root.nodes(low, high, this)) {
			for (let i = start; i < end; i++) yield node._keys[i];
		}
	}

	*values(low = this.minKey(), high = this.maxKey()): Generator<V> {
		for (const { node, start, end } of this.root.nodes(low, high, this)) {
			for (let i = start; i < end; i++) yield node._values[i];
		}
	}
}

// For debugging
export function toString(n: BTree<any, any> | Node<any, any>, depth = 0) {
	let res = "";
	if (n instanceof BTree) {
		res += `l${pc.dim(n.root.length)} s${pc.dim(n.size)}\n`;
		res += toString(n.root);
		return res;
	}

	if (depth > 0) res += "\n";
	res += "\t".repeat(depth);
	for (let i = 0; i < n._values.length; i++) {
		const val = n._values[i];
		if (val instanceof Node) {
			res += `${pc.blue(n._keys[i] ?? "empty")} l${pc.dim(n._values[i]._length)}`;
			res += " " + JSON.stringify(n._values[i]._marks);
			res += toString(val, depth + 1);
			if (i !== n._values.length - 1) res += "\n" + "\t".repeat(depth);
		} else {
			res += pc.blue(n._keys[i]);
			res += " => ";
			res += pc.green(val);
			if (i !== n._values.length - 1) res += ", ";
		}
	}

	return res;
}
