import { sql } from "drizzle-orm";
import {
	int,
	sqliteTable,
	text,
	customType,
	primaryKey,
	foreignKey,
} from "drizzle-orm/sqlite-core";

// only good for small blobs
const hexBlob = customType<{ data: Uint8Array; driverData: Buffer | Uint8Array }>({
	dataType: () => "blob",
	fromDriver: (value) => new Uint8Array(value),
	toDriver: (value) => sql`unhex(${value.toHex()})`,
});
const docId = customType<{ data: bigint; driverData: bigint | number }>({
	dataType: () => "integer",
	fromDriver: (value) => BigInt(value),
	toDriver: (value) => sql`${value.toString()}`,
});

export const doc = sqliteTable("doc", {
	id: docId().primaryKey(),
		// .default(sql`((unixepoch() << 16) + (abs(random()) % (1 << 16)))`),
	version: hexBlob(),
	lang: text().notNull(),
	book: text(),
	title: text(),
});

const textList = customType<{ data: string[] }>({
	dataType: () => "text[]",
});

export const author = sqliteTable("author", {
	id: int().primaryKey(),
	name: text().notNull(),
	urls: textList(),
});

export const docCredit = sqliteTable(
	"doc_credit",
	{
		doc: docId()
			.notNull()
			.references(() => doc.id),
		author: int()
			.notNull()
			.references(() => author.id),
		credits: textList(),
	},
	(t) => [primaryKey({ columns: [t.doc, t.author] })],
);

const timestamp = customType<{ data: Date; driverData: string }>({
	dataType: () => "timestamp",
	fromDriver: (value) => new Date(value),
	toDriver: (value: Date) => sql`${value.toISOString()}`,
});

const blobList = customType<{ data: Uint8Array[] }>({
	dataType: () => "blob[]",
});

export const changeSet = sqliteTable("change_set", {
	id: hexBlob().primaryKey(), // sha256 of rest of fields
	doc: docId().references(() => doc.id),
	author: text(),
	timestamp: timestamp(),
	message: text(),
	changes: text(),
	parents: blobList(),
});

const json = customType<{
	data: any;
	driverData: string;
}>({
	dataType: () => "jsonb",
	fromDriver: (value) => JSON.parse(value),
	toDriver: (value) => sql`${JSON.stringify(value)}`,
});

export const plot = sqliteTable(
	"plot",
	{
		doc: docId()
			.notNull()
			.references(() => doc.id),
		id: int().notNull(),
		type: text().notNull(),
		param: json(),
		marks: json(),
		length: int(),
		parent: int(),
		text_content: text(),
		content: json(),
	},
	(t) => [
		primaryKey({ columns: [t.doc, t.id] }),
		foreignKey({ columns: [t.doc, t.parent], foreignColumns: [t.doc, t.id] }),
	],
);

export const annotation = sqliteTable(
	"annotation",
	{
		id: int().primaryKey(),
		tags: textList(),
		param: json(),
		doc: docId(),
		version: hexBlob(),
		start_pos: int().notNull(),
		end_pos: int(),
	},
	(t) => [
		foreignKey({
			columns: [t.doc, t.version],
			foreignColumns: [changeSet.doc, changeSet.id],
		}),
	],
);

export const xref = sqliteTable("xref", {
	id: int().primaryKey(),
	tags: textList(),
	from_doc: docId().notNull(),
	from_doc_version: hexBlob().notNull(),
	from_doc_start_pos: int().notNull(),
	from_doc_end_pos: int(),
	to_doc: docId().notNull(),
	to_doc_version: hexBlob().notNull(),
	to_doc_start_pos: int().notNull(),
	to_doc_end_pos: int(),
});
