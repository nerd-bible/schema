import {
	int,
	sqliteTable,
	text,
	primaryKey,
	foreignKey,
} from "drizzle-orm/sqlite-core";
import { hexBlobList, int64, hexBlob, json, textList, timestamp } from "./types.ts";

export const doc = sqliteTable("doc", {
	id: int64().primaryKey(),
		// .default(sql`((unixepoch() << 16) + (abs(random()) % (1 << 16)))`),
	version: hexBlob(),
	lang: text().notNull(),
	book: text(),
	title: text(),
});

export const author = sqliteTable("author", {
	id: int().primaryKey(),
	name: text().notNull(),
	urls: textList(),
});

export const docCredit = sqliteTable(
	"doc_credit",
	{
		doc: int64()
			.notNull()
			.references(() => doc.id),
		author: int()
			.notNull()
			.references(() => author.id),
		credits: textList(),
	},
	(t) => [primaryKey({ columns: [t.doc, t.author] })],
);

export const changeSet = sqliteTable("change_set", {
	id: hexBlob().primaryKey(), // sha256 of rest of fields
	doc: int64().references(() => doc.id),
	author: text(),
	timestamp: timestamp(),
	message: text(),
	changes: text(),
	parents: hexBlobList(),
});

export const plot = sqliteTable(
	"plot",
	{
		doc: int64()
			.notNull()
			.references(() => doc.id),
		id: text().notNull(),
		type: text().notNull(),
		param: json(),
		marks: json(),
		length: int().notNull(),
		parent: text(),
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
		doc: int64(),
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
	from_doc: int64().notNull(),
	from_doc_version: hexBlob().notNull(),
	from_doc_start_pos: int().notNull(),
	from_doc_end_pos: int(),
	to_doc: int64().notNull(),
	to_doc_version: hexBlob().notNull(),
	to_doc_start_pos: int().notNull(),
	to_doc_end_pos: int(),
});
