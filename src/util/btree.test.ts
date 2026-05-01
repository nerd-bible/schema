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
	const tree = new BTree<string>(undefined, 10);
	const map = new Map<bigint, string>();

	let min: bigint | undefined;
	let max: bigint | undefined;
	const arr = shuffle([...Array(20).keys().map(k => BigInt(k))]);

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
	expect(tree.min()).toBe(min);
	expect(tree.max()).toBe(max);

	for (const [k, v] of map.entries()) expect(tree.get(k)).toBe(v);

	let last = -1n;
	let i = 0;
	for (const n of tree.keys()) {
		expect(last).toBeLessThan(n);
		last = n;
		i++;
	}
	expect(i).toBe(arr.length);
});
