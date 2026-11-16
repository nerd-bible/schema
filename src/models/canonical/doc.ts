// TODO: nice binary format that supports partial loading, better compression,
// and indexing
import * as z from "zod";
import { richText } from "./richText.ts";

export const sourceMap = z
	.strictObject({
		type: z.literal("sourceMap"),
		schema: z.literal(1),
		fromId: z.string(),
		fromGitHash: z.string().optional(),
		fromPos: z.int().array(),
		fromLen: z.int().array(),
		toId: z.string(),
		toGitHash: z.string().optional(),
		toPos: z.int().array(),
		toLen: z.int().array(),
	})
	.refine(({ fromPos, fromLen, toPos, toLen }) => {
		if (fromPos.length != fromLen.length)
			return { error: "invalid sourcemap fromLen length" };
		if (fromPos.length != toPos.length)
			return { error: "invalid sourcemap toPos length" };
		if (fromPos.length != toLen.length)
			return { error: "invalid sourcemap toLen length" };
	});
export type SourceMap = z.output<typeof sourceMap>;

export const doc = z.discriminatedUnion("type", [richText, sourceMap]);
export type Doc = z.output<typeof doc>;
