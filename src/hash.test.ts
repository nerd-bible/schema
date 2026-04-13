import { test } from "node:test";
import { expect } from "expect";
import { Hasher } from "./hash.ts";
import JSBI from "jsbi";

test("Hasher", async () => {
	const h = new Hasher("SHA-512");
	await h.string("hello");
	await h.number(1);
	await h.boolean(true);
	await h.undefined();
	await h.bigint(JSBI.BigInt("201203012030120301203123012031123123123"));
	await h.object({ foo: "bar", bar: "baz" });
	const expected = Uint8Array.from([
		114, 180, 130, 69, 75, 123, 192, 48, 67, 206, 129, 95, 77, 66, 123, 111, 75,
		251, 198, 241, 94, 187, 169, 115, 136, 55, 93, 231, 156, 183, 58, 148, 101,
		177, 207, 66, 132, 76, 87, 49, 36, 44, 130, 14, 28, 48, 228, 211, 122, 37,
		180, 88, 65, 169, 150, 176, 108, 32, 8, 17, 23, 107, 12, 132,
	]);
	expect(h.hash.byteLength).toEqual(64);
	expect(new Uint8Array(h.hash)).toEqual(expected);
});
