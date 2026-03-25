import * as v from "@nerd-bible/valio";

export const docId = v
	.string()
	.refine((s) => s.split("/").length === 3, "contains 2 '/'");
export const wordId = v.number().gte(1).lte(Number.MAX_SAFE_INTEGER);

export const doc = v.object({ id: docId });

export const word = v
	.object({
		doc: docId,
		id: wordId,
		position: v.number(),

		form: v.string(),
		isTetragram: v.boolean(),

		chapter: v.number(),
		verse: v.number(),

		stem: v.string(),
		lemma: v.string(),

		sources: v.array(v.object({ doc: docId, id: v.number() })),

		// For grammarians
		conllu: v
			.object({
				upos: v.string(),
				xpos: v.string(),
				feats: v.record(v.string(), v.string()),
				head: v.number(),
				deprel: v.string(),
				deps: v.record(v.string(), v.string()),
				misc: v.record(v.string(), v.string()),
			})
			.partial({
				upos: true,
				xpos: true,
				feats: true,
				head: true,
				deprel: true,
				deps: true,
				misc: true,
			}),
		// Blocks cannot nest
		block: v.union([
			v.object({
				tag: v.literal("p"),
				depth: v.number(),
				attrs: v.object({ class: v.string(), dir: v.enum(["ltr", "rtl"]) }),
			}),
			v.object({
				tag: v.literal("h"),
				depth: v.number(),
				attrs: v.object({ level: v.number().gte(1).lte(6) }),
			}),
			v.object({
				tag: v.literal("blockquote"),
				depth: v.number(),
				attrs: v.object({ class: v.string(), dir: v.enum(["ltr", "rtl"]) }),
			}),
			v.object({
				tag: v.literal("ol"),
				depth: v.number(),
				attrs: v.object({ class: v.string() }),
			}),
			v.object({
				tag: v.literal("ul"),
				depth: v.number(),
				attrs: v.object({ class: v.string() }),
			}),
			v.object({ tag: v.literal("li"), depth: v.number() }),
			v.object({ tag: v.literal("hr"), depth: v.number() }),
		]),
	})
	.partial({
		chapter: true,
		verse: true,
		stem: true,
		lemma: true,
	});

export const wordSpan = v.object({
	doc: docId,

	start: v.number(),
	end: v.number(),

	value: v.union([
		v.object({ tag: v.literal("quote"), cite: v.string() }),
	]),
});
