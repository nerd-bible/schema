import { sql } from "drizzle-orm";
import {
	int,
	sqliteTable,
	text,
	customType,
	primaryKey,
	blob,
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
	dataType() {
		return "text[]";
	},
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

const timestamp = customType<{ data: Date }>({
	dataType() {
		return "timestamp";
	},
});

const blobList = customType<{ data: Uint8Array }>({
	dataType() {
		return "blob[]";
	},
});

export const changeSet = sqliteTable("change_set", {
	id: blob().primaryKey(), // sha256 of parents, timestamp, and changeset
	doc: int().references(() => doc.id),
	timestamp: timestamp(),
	changes: text(),
	parents: blobList(),
});

const json = customType<{
	data: any,
	driverData: string,
}>({
	dataType() {
		return "jsonb";
	},
	fromDriver(value: string) {
		return JSON.parse(value);
	},
	toDriver(value: any) {
		return sql`${JSON.stringify(value)}`;
	},
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
