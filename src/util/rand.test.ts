import { test } from "node:test";
import { expect } from "expect";
import { tsid64 } from "./rand.ts";

test("tsid64", () => {
	const ts = new Date("2026-09-29T00:00:00Z");
	const random = tsid64(ts);

	const arr = new BigInt64Array([random]);
	const bytes = new Uint8Array(arr.buffer);

	expect(bytes.slice(2).toHex()).toEqual("000c76eaa001");
});
