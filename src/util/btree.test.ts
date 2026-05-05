import { test } from "node:test";
import { expect } from "expect";
import { BTree } from "./btree.ts";

function shuffle<T>(arr: T[]): T[] {
	let i = arr.length;

	while (i != 0) {
		let j = Math.floor(Math.random() * i);
		i--;
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

test("correctness", () => {
	const tree = new BTree<bigint, string>(undefined, 4);
	const map = new Map<bigint, string>();

	let min: bigint | undefined;
	let max: bigint | undefined;
	const arr = shuffle([
		...Array(tree.maxNodeSize * tree.maxNodeSize - 1)
			.keys()
			.map(BigInt),
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

	expect(tree.size).toBe(arr.length);
	expect(tree.minKey()).toBe(min);
	expect(tree.maxKey()).toBe(max);

	for (const [k, v] of map.entries()) expect(tree.get(k)).toBe(v);

	let last = -1n;
	let i = 0;
	for (const n of tree.keys()) {
		expect(last).toBeLessThanOrEqual(n);
		last = n;
		i++;
	}
	expect(i).toBe(arr.length);

	for (const k of map.keys()) expect(tree.delete(k)).toBe(true);
	// console.dir(tree.root.children, { depth: null });
	expect(tree.delete(2n)).toBe(false);
	expect(tree.get(2n)).toBeUndefined();
});
