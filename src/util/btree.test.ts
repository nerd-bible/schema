import { test } from "node:test";
import { expect } from "expect";
import { BTree, toString } from "./btree.ts";

function shuffle<T>(arr: T[]): T[] {
	let i = arr.length;

	while (i != 0) {
		let j = Math.floor(Math.random() * i);
		i--;
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

function cmp(a: bigint, b: bigint): number {
	const diff = a - b;
	if (diff > 0) return 1;
	if (diff < 0) return -1;
	return 0;
}

test("btree set, delete, min, max", () => {
	const tree = new BTree<bigint, string>(4);
	const map = new Map<bigint, string>();

	let min: bigint | undefined;
	let max: bigint | undefined;
	const arr = ([
		...Array(tree.maxNodeSize * tree.maxNodeSize)
			.keys()
			.map((n) => BigInt((n + 1) * 3)),
	]);

	for (let i = 0; i < arr.length; i++) {
		const k = arr[i];
		const v = k.toString();

		map.set(k, v);
		tree.set(k, v);
		if (max == null || k > max) max = k;
		if (min == null || k < min) min = k;

		expect(tree.get(k)).toBe(v);
	}
	console.log(toString(tree));

	expect(tree.size).toBe(arr.length);
	expect(tree.minKey()).toBe(min);
	expect(tree.maxKey()).toBe(max);

	for (const [k, v] of map.entries()) expect(tree.get(k)).toBe(v);
	expect([...tree.keys()].sort(cmp)).toEqual([...map.keys()].sort(cmp));

	let last = -1n;
	let i = 0;
	for (const n of tree.keys()) {
		expect(last).toBeLessThanOrEqual(n);
		last = n;
		i++;
	}
	expect(i).toBe(arr.length);

	for (const k of map.keys()) expect(tree.delete(k)).toBeGreaterThan(0);
	expect(tree.delete(2n)).toBe(-1);
	expect(tree.get(2n)).toBeUndefined();
	console.log(toString(tree));
});

const map = new Map<bigint, string>([
	[15n, " created"],
	[12n, " God"],
	[9n, " beginning"],
	[6n, " the"],
	[3n, "in"],
]);
function treeSample() {
	const tree = new BTree<bigint, string>(undefined, 4);
	for (const [k, v] of map.entries()) tree.set(k, v);
	return tree;
}

test("btree mark", () => {
	const tree = treeSample();

	console.log(toString(tree));
	tree.mark(5n, 13n, { em: {} });
	// tree.mark(5n, 10n, { tag: "WOW" });
	console.log(toString(tree));
});

test("btree getpos", () => {
	const tree = treeSample();

	const expectedLength = map.values().reduce((acc, cur) => acc + cur.length, 0);
	expect(tree.size).toBe(map.size);
	expect(tree.length).toBe(expectedLength);

	expect(tree.getPos(0)).toEqual({ key: 3n, value: "in", offset: 0 });
	expect(tree.getPos(1)).toEqual({ key: 3n, value: "in", offset: 1 });
	expect(tree.getPos(2)).toEqual({ key: 6n, value: " the", offset: 0 });
	expect(tree.getPos(21)).toEqual({ key: 15n, value: " created", offset: 1 });

	expect(tree.delete(6n)).toBe(map.get(6n)!.length);

	expect(tree.getPos(0)).toEqual({ key: 3n, value: "in", offset: 0 });
	expect(tree.getPos(2)).toEqual({ key: 9n, value: " beginning", offset: 0 });
	expect(tree.length).toBe(expectedLength - map.get(6n)!.length);
});
