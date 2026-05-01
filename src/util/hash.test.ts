import { test } from "node:test";
import { expect } from "expect";
import { Hasher } from "./hash.ts";

test("Hasher", async () => {
	const h = new Hasher("SHA-512");
	await h.string("hello");
	await h.number(1);
	await h.boolean(true);
	await h.undefined();
	await h.bigint(201203012030120301203123012031123123123n);
	await h.object({ foo: "bar", bar: "baz" });
	const expected = Uint8Array.from([
		197, 218, 12, 218, 180, 104, 87, 245, 80, 49, 158, 188, 48, 51, 2, 107, 91,
		75, 22, 21, 179, 135, 76, 114, 205, 139, 188, 55, 38, 120, 187, 242, 139,
		42, 13, 41, 76, 91, 237, 56, 53, 67, 70, 202, 149, 146, 66, 235, 163, 237,
		247, 244, 131, 124, 62, 221, 44, 27, 63, 242, 78, 161, 189, 199,
	]);
	expect(h.hash.byteLength).toEqual(64);
	expect(new Uint8Array(h.hash)).toEqual(expected);
});
