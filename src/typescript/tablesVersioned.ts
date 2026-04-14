import * as v from "@nerd-bible/valio";
import * as ref from "@nerd-bible/ref";

// collision chance for 100k ids:
// 32 bit = .69
// 53 bit = 5.5e-7 <- Max safe integer, requires JS bigint to generate
// 64 bit = 2.7e-10 <- Requires JS bigint to generate and read
// https://kevingal.com/apps/collision.html
const id = v.bigint().register("col", "PRIMARY KEY");
const docId = v.bigint().register("col", "REFERENCES doc(id)");
const lang = v.string(); // ISO-639
const book = v.enum(ref.book.ids); // if scripture

// A user publication, note, outline, or xref.
export const doc = v
	.object({ id, lang })
	.extendPartial({ name: v.string(), urls: v.array(v.string()) });
export type Doc = v.Output<typeof doc>;
export const scripture = v
	.object({
		doc: docId,
		book,
		code: v.string(), // like BSB, ESV, etc.
	})
	.extendPartial({ published: v.date() });
export type Scripture = v.Output<typeof scripture>;
export const highlight = v
	.object({ doc: docId, name: v.string() })
	.extendPartial({
		backgroundColor: v.string(),
		textDecoration: v.string(),
	});
export type Highlight = v.Output<typeof highlight>;
export const note = v
	.object({
		doc: docId,
		ref: docId,
		refStart: v.bigint(),
	})
	.extendPartial({
		refEnd: v.bigint(),
		highlight: v.bigint().register("col", "REFERENCES highlight(doc)"),
	})
	.register(
		"table",
		[
			"FOREIGN KEY (ref, refStart) REFERENCES word(doc, id)",
			"FOREIGN KEY (ref, refEnd) REFERENCES word(doc, id)",
		].join(",\n\t"),
	)
	.register("extra", "CREATE INDEX noteDoc ON note(ref, refStart);");
export type Note = v.Output<typeof note>;
export const outline = v
	.object({
		doc: docId,
		scripture: v.bigint().register("col", "REFERENCES scripture(id)"),
		book,
		chapter: v.number(),
		verse: v.number(),
		level: v.number(),
		text: v.string(),
	})
	.register("table", "PRIMARY KEY (doc, book, chapter, verse)");
export type Outline = v.Output<typeof outline>;
export const xref = v
	.object({
		doc: docId,
		src: docId,
		srcStart: v.bigint(),
		dest: docId,
		tag: v.string(),
	})
	.extendPartial({
		srcEnd: v.bigint(),
		destStart: v.bigint(),
		destEnd: v.bigint(),
	})
	.register(
		"table",
		[
			"FOREIGN KEY (src, srcStart) REFERENCES word(doc, id)",
			"FOREIGN KEY (src, srcEnd) REFERENCES word(doc, id)",
			"FOREIGN KEY (dest, destStart) REFERENCES word(doc, id)",
			"FOREIGN KEY (dest, destEnd) REFERENCES word(doc, id)",
		].join(",\n\t"),
	);
export type Xref = v.Output<typeof xref>;
// Misc KV for tagging and filtering.
export const docTag = v
	.object({
		doc: docId,
		tag: v.string(),
	})
	.extendPartial({ data: v.any() })
	.register("extra", "CREATE INDEX docTagTag ON docTag(tag, data)");
export type DocTag = v.Output<typeof docTag>;

// Document content
export const word = v
	.object({
		doc: docId,
		id: v.bigint(),
	})
	.extendPartial({
		lang: v.string(),
		text: v.string(),
	})
	.register("table", "PRIMARY KEY (doc, id)")
	.register("extra", "CREATE INDEX wordLangText ON word(lang, text)");
export type Word = v.Output<typeof word>;
export const mark = v
	.object({
		doc: docId,
		start: v.bigint(), // inclusive
		tag: v.enum([
			"p", // paragraph
			"c", // chapter
			"v", // verse
			"ol", // ordered list
			"ul", // unordered list
			"li", // list item
			"q", // quote
			"h", // heading
			"em", // emphasis (italic)
			"strong", // strong (bold)
		]),
	})
	.extendPartial({
		data: v.any(),
		end: v.bigint(), // inclusive
	})
	.register(
		"table",
		[
			"FOREIGN KEY (doc, start) REFERENCES word(doc, id)",
			"FOREIGN KEY (doc, end) REFERENCES word(doc, id)",
		].join(",\n\t"),
	)
	.register(
		"extra",
		[
			"CREATE INDEX markStart ON mark(start, tag)",
			"CREATE INDEX markEnd ON mark(end, tag)",
		].join(";\n"),
	);
export type Mark = v.Output<typeof mark>;
