import { binarySearch } from "./bsearch.ts";
import pc from "picocolors";

type Comparable = number | bigint | Date | string;
type Length = { readonly length: number };
const comparator = (a: Comparable, b: Comparable) => {
	if (a > b) return 1;
	if (b > a) return -1;
	return 0;
};
function indexOf<K extends Comparable>(
	ctx: Leaf<K, any> | Internal<K, any>,
	key: K,
	failXor: number,
) {
	return binarySearch(ctx._keys, key, comparator, failXor);
}
type NodeGenerator<K extends Comparable, V extends Length> = Generator<{
	node: Leaf<K, V>;
	start: number;
	end: number;
}>;

type Marks = {
	[tag: string]: Record<string, string | number | boolean | null | undefined>;
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
	_marks: Marks;

	constructor(
		values: (Internal<K, V> | Leaf<K, V>)[] | V[] = [],
		keys: K[] = [],
		length = values.reduce((acc, c) => acc + c.length, 0),
		marks: Marks = {},
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

	resolve(key: K, failXor: number = 0, path?: number[]) {
		const idx = this.indexOf(key, failXor, path);
		const child = this._values[idx];
		if (child instanceof Node) child.resolve(key, failXor, path);
	}

	indexOf(key: K, failXor: number = 0, path?: number[]): number {
		const idx = indexOf(
			this as unknown as Internal<K, V> | Leaf<K, V>,
			key,
			failXor,
		);
		path?.push(idx);
		return idx;
	}

	splitRight(idx: number) {
		const right = this.clone();
		right._keys = this._keys.splice(idx);
		right._values = this._values.splice(idx);
		right._length = right._values.reduce((acc, c) => acc + c.length, 0);
		this._length -= right._length;
		return right;
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

	clone() {
		return new Leaf(this._values.slice(), this._keys.slice(), this.length, {
			...this._marks,
		});
	}

	get(key: K): V | undefined {
		const idx = this.indexOf(key, -1);
		return this._values[idx];
	}

	set(key: K, value: V, path: number[]): void {
		const idx = this.indexOf(key, 0, path);
		this._keys.splice(idx, 0, key);
		this._values.splice(idx, 0, value);
		this._length += value.length;
	}

	delete(key: K, path: number[]): number {
		const idx = this.indexOf(key, -1, path);
		if (idx !== -1) {
			const { length } = this._values[idx];
			this._keys.splice(idx, 1);
			this._values.splice(idx, 1);
			this._length -= length;
			return length;
		}
		return -1;
	}

	*leaves(low: K, high: K): NodeGenerator<K, V> {
		const start = this.indexOf(low);
		let end = start;
		while (this._keys[end] <= high && end < this._keys.length) end++;
		yield { node: this, start, end };
	}
}

export class Internal<K extends Comparable, V extends Length> extends Node<
	K,
	V
> {
	declare _values: (Internal<K, V> | Leaf<K, V>)[];

	clone() {
		return new Internal(this._values.slice(), this._keys.slice(), this.length, {
			...this._marks,
		});
	}

	minKey(): K {
		return this._values[0].minKey();
	}

	get(key: K): V | undefined {
		const idx = this.indexOf(key);
		return this._values[idx].get(key);
	}

	set(key: K, value: V, path: number[]): void {
		const idx = Math.min(this.indexOf(key), this._values.length - 1);
		path.push(idx);
		const child = this._values[idx];
		child.set(key, value, path);
		if (this._keys[idx] == null || key > this._keys[idx]) this._keys[idx] = key;
		this._length += value.length;
	}

	delete(key: K, path: number[]): number {
		const idx = this.indexOf(key, 0, path);
		const child = this._values[idx];
		const res = child?.delete(key, path) ?? -1;
		if (res != -1) {
			this._length -= res;
			if (this._values.length === 1 && this._values[0]._length === 0) {
				this._keys = [];
			}
		}
		return res;
	}

	adopt(
		right: Internal<K, V> | Leaf<K, V>,
		idx: number = this.indexOf(right.maxKey()),
	) {
		this._keys[idx] = this._values[idx].maxKey();
		this._values.splice(idx + 1, 0, right);
		this._keys.splice(idx + 1, 0, right.maxKey());
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

	tryMergeLeft(idx: number, tree: BTree): boolean {
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

	*leaves(low: K, high: K): NodeGenerator<K, V> {
		const start = this.indexOf(low);
		for (let i = start; this._keys[i] <= high; i++)
			yield* this._values[i].leaves(low, high);
	}
}

export class BTree<K extends Comparable = any, V extends Length = any> {
	maxNodeSize: number;
	splitNodeSize: number;
	minNodeSize: number;
	root = new Internal<K, V>([new Leaf<K, V>()]);
	_depth = 2;
	_size = 0;
	/** For balancing after delete/set/split */
	_path: number[] = [];

	constructor(maxNodeSize = 64, splitNodeSize = Math.floor(maxNodeSize * 0.8)) {
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

	get depth(): number {
		return this._depth;
	}

	minKey(): K {
		return this.root.minKey();
	}

	maxKey(): K {
		return this.root.maxKey();
	}

	get(key: K): V | undefined {
		return this.root.get(key);
	}

	getPos(pos: number): { key: K; value: V; offset: number } | undefined {
		return this.root.getPos(pos);
	}

	set(key: K, value: V): void {
		this.root.set(key, value, (this._path = []));
		this._size += 1;
		this.balanceSplitting(this._path);
	}

	resolve(path: number[]): (Internal<K, V> | Leaf<K, V>)[] {
		const nodes: ReturnType<typeof this.resolve> = [this.root];
		for (const p of path.slice(0, -1)) {
			nodes.push((nodes[nodes.length - 1] as Internal<K, V>)._values[p]);
		}
		return nodes;
	}

	balanceSplitting(path: number[]) {
		const nodes = this.resolve(path);
		for (let i = nodes.length - 1; i >= 0; i--) {
			const node = nodes[i];
			if (node._values.length > this.maxNodeSize) {
				const right = node.splitRight(this.splitNodeSize);
				const parent = nodes[i - 1] as Internal<K, V>;
				if (parent) parent.adopt(right, path[i - 1]);
				else {
					this.root = new Internal(
						[this.root, right],
						[this.root.maxKey(), right.maxKey()],
						this.root.length + right.length,
						{ ...this.root._marks },
					);
					this._depth++;
				}
			}
		}
	}

	balanceMerging(path: number[]) {
		const nodes = this.resolve(path);
		for (let i = nodes.length - 2; i >= 0; i--) {
			const parent = nodes[i] as Internal<K, V>;
			const grandparent = nodes[i - 1] as Internal<K, V>;
			if (
				parent.tryMergeLeft(path[i], this) ||
				parent.tryMergeLeft(path[i + 1], this)
			) {
				if (grandparent && parent._values.length === 1) {
					grandparent._values = parent._values;
					this._depth--;
				}
			}
		}
	}

	/**
	 * Delete single occurence of `key`.
	 *
	 * @returns {number} length of deleted item or -1 if none deleted
	 */
	delete(key: K): number {
		const res = this.root.delete(key, (this._path = []));
		if (res !== -1) {
			this._size -= 1;
			this.balanceMerging(this._path);
		}
		return res;
	}

	split(key: K): void {
		const path = (this._path = []);
		this.root.resolve(key, 0, path);
		const nodes = this.resolve(path);
		const leaf = nodes[nodes.length - 1] as Leaf<K, V>;
		const leafParent = nodes[nodes.length - 2] as Internal<K, V>;
		const right = leaf.splitRight(path[path.length - 1]);
		leafParent.adopt(right, path[path.length - 2]);
	}

	mark(low: K, high: K, marks: Marks) {
		this.split(low);
		this.split(high);

		// Decide if should toggle
		let nodeCount = 0;
		const count: Record<string, number> = {};
		for (const n of this.root.leaves(low, high)) {
			for (const t in n.node._marks) {
				count[t] ??= 0;
				count[t]++;
			}
			nodeCount++;
		}

		for (const n of this.root.leaves(low, high)) {
			for (const t in marks) {
				if (count[t] === nodeCount) delete n.node._marks[t];
				else n.node._marks[t] = marks[t];
			}
		}

		// TODO: try sibling node merger
	}

	*keys(low = this.minKey(), high = this.maxKey()): Generator<K> {
		for (const { node, start, end } of this.root.leaves(low, high)) {
			for (let i = start; i < end; i++) yield node._keys[i];
		}
	}

	*values(low = this.minKey(), high = this.maxKey()): Generator<V> {
		for (const { node, start, end } of this.root.leaves(low, high)) {
			for (let i = start; i < end; i++) yield node._values[i];
		}
	}
}

// For debugging
export function toString(n: BTree<any, any> | Node<any, any>, depth = 0) {
	let res = "";
	if (n instanceof BTree) {
		res += `l${pc.dim(n.root.length)} s${pc.dim(n.size)} d${pc.dim(n.depth)}\n`;
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
