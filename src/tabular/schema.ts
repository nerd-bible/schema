import { sql } from "drizzle-orm";
import {
	int,
	sqliteTable,
	text,
	customType,
	primaryKey,
	foreignKey,
} from "drizzle-orm/sqlite-core";

export const doc = sqliteTable("doc", {
	id: int()
		.primaryKey()
		.default(sql`((unixepoch() << 16) + (abs(random()) % (1 << 16)))`),
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
		doc: int()
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

// only good for small blobs
const blob = customType<{ data: Uint8Array; driverData: Buffer | Uint8Array }>({
	dataType: () => "blob",
	fromDriver: (value) => new Uint8Array(value),
	toDriver: (value) => sql`unhex(${value.toHex()})`,
});

const blobList = customType<{ data: Uint8Array[] }>({
	dataType: () => "blob[]",
});

export const changeSet = sqliteTable("change_set", {
	id: blob().primaryKey(), // sha256 of rest of fields
	doc: int().references(() => doc.id),
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
		doc: int()
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
		doc: int(),
		version: blob(),
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
	from_doc: int().notNull(),
	from_doc_version: blob().notNull(),
	from_doc_start_pos: int().notNull(),
	from_doc_end_pos: int(),
	to_doc: int().notNull(),
	to_doc_version: blob().notNull(),
	to_doc_start_pos: int().notNull(),
	to_doc_end_pos: int(),
});

export const foo = sqliteTable("foo", {
	id: int().primaryKey(),
});
