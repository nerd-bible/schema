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
	const tree = new BTree<string>();
	const map = new Map<number, string>();

	let min: number | undefined;
	let max: number | undefined;
	const arr = [...Array(tree.maxNodeSize * tree.maxNodeSize).keys()];

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

	let last = -1;
	let i = 0;
	for (const n of tree.keys()) {
		expect(last).toBeLessThanOrEqual(n);
		last = n;
		i++;
	}
	expect(i).toBe(arr.length);

	// console.dir(tree.root!.children[0], { depth: null });
	expect(tree.delete(2)).toBe(true);
	expect(tree.get(2)).toBeUndefined();
});
