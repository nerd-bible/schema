import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/sqlite-core";

// PRIMITIVES
// only good for small blobs
export const blob32 = customType<{
	data: Uint8Array;
	driverData: Buffer | Uint8Array;
}>({
	dataType: () => "blob",
	toDriver: (value) => {
		if (value.length !== 32) throw new Error("expected 32 byte array, got " + value.length);
		return new Uint8Array(value);
	},
	// Node return a Buffer, WASM a Uint8Array
	fromDriver: (value) => {
		if (value.length !== 32) throw new Error("expected 32 byte array, got " + value.length);
		return new Uint8Array(value);
	}
});

export const int64 = customType<{ data: bigint; driverData: bigint | number }>({
	dataType: () => "integer",
	toDriver: (value) => sql`${value.toString()}`,
	fromDriver: (value) => BigInt(value),
});

export const timestamp = customType<{ data: Date; driverData: string }>({
	dataType: () => "timestamp",
	toDriver: (value: Date) => sql`${value.toISOString()}`,
	fromDriver: (value) => new Date(value),
});

// CONTAINERS
export const json = customType<{
	data: any;
	driverData: string;
}>({
	dataType: () => "jsonb",
	toDriver: (value) => sql`${JSON.stringify(value)}`,
	fromDriver: (value) => JSON.parse(value),
});

// turso's array feature is broken right now, but i would like to use it for
// lists. once these are fixed it should be fine:
// - https://github.com/tursodatabase/turso/issues/9448
// - https://github.com/tursodatabase/turso/issues/9449
// - https://github.com/tursodatabase/turso/issues/9451
export const textList = customType<{ data: string[]; driverData: string }>({
	dataType: () => "jsonb",
	toDriver: (value) => sql`${JSON.stringify(value)}`,
	fromDriver: (value) => JSON.parse(value),
});

export const blob32List = customType<{
	data: Uint8Array[];
	driverData: Buffer | Uint8Array;
}>({
	dataType: () => "blob",
	toDriver: (value) => {
		const res = new Uint8Array(value.length * 32);
		let offset = 0;
		for (const v of value) {
			if (v.length !== 32) throw new Error("expected 32 byte array, got " + v.length);
			res.set(v, offset);
			offset += v.length;
		}
		return res;
	},
	fromDriver: (value) => {
		if (value.length % 32 != 0) throw new Error("expected 32 byte arrays got " + value.length);
		const res = new Array(value.length / 32);
		for (let i = 0; i < res.length; i++) {
			res[i] = value.subarray(i * 32, (i + 1) * 32);
		}
		return res;
	},
});
