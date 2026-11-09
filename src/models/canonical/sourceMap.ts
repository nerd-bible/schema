import * as z from "zod";

export const SourceMap = z.object({
	fromId: z.string(),
	fromObjectHash: z.string().optional(),
	fromPos: z.array(z.int()),
	fromLen: z.array(z.int()),
	toId: z.string(),
	toObjectHash: z.string().optional(),
	toPos: z.array(z.int()),
	toLen: z.array(z.int()),
}).refine(({ fromPos, fromLen, toPos, toLen }) => {
	if (fromPos.length != fromLen.length) return { error: "invalid sourcemap fromLen length" };
	if (fromPos.length != toPos.length) return { error: "invalid sourcemap toPos length" };
	if (fromPos.length != toLen.length) return { error: "invalid sourcemap toLen length" };
});
