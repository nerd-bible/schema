import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/sqlite-core";

// PRIMITIVES
// only good for small blobs
export const hexBlob = customType<{
	data: Uint8Array;
	driverData: Buffer | Uint8Array;
}>({
	dataType: () => "blob",
	fromDriver: (value) => new Uint8Array(value),
	toDriver: (value: Uint8Array) => sql`unhex(${value.toHex()})`,
});

export const int64 = customType<{ data: bigint; driverData: bigint | number }>({
	dataType: () => "integer",
	fromDriver: (value) => BigInt(value),
	toDriver: (value) => sql`${value.toString()}`,
});

export const timestamp = customType<{ data: Date; driverData: string }>({
	dataType: () => "timestamp",
	fromDriver: (value) => new Date(value),
	toDriver: (value: Date) => sql`${value.toISOString()}`,
});

// CONTAINERS
export const json = customType<{
	data: any;
	driverData: string;
}>({
	dataType: () => "jsonb",
	fromDriver: (value) => JSON.parse(value),
	toDriver: (value) => sql`${JSON.stringify(value)}`,
});

export const textList = customType<{ data: string[]; driverData: string }>({
	dataType: () => "text[]",
	fromDriver: (value) => {
		console.warn("IDK", typeof value, value);
		value.substring(1, value.length - 1).split(",");
		return [];
	},
	toDriver: (value) => sql`${JSON.stringify(value)}`,
});

export const hexBlobList = customType<{ data: Uint8Array[] }>({
	dataType: () => "blob[]",
	fromDriver: (value) => {
		console.warn("IDK", typeof value, value);
		return [];
	},
	toDriver: (value) =>
		sql`array(${value.map(v => `unhex('${v.toHex()}')`).join(",")})`,
});
