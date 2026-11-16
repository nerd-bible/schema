import * as z from "zod";

export const id = z.uuidv4();
export type Id = z.output<typeof id>;

export const meta = z
	.strictObject({
		title: z.string(),
		book: z.string(), // if biblical
		authors: z.string().array(),
		xrefs: id.array(), // things it references
		sources: id.array(), // if translation
	})
	.partial()
	.safeExtend({
		id,
		published: z.date(),
		lang: z.string(),
		title: z.string().optional(),
	});
export type Meta = z.output<typeof meta>;

const wgNode = z.strictObject({
	type: z.string(),
	param: z.any().optional(),
	marks: z.looseRecord(z.string(), z.any()).optional(),
	get content() {
		return wgNode.array().optional();
	},
});
const wgToken = z.union([wgNode, z.literal(".")]);
const wgModification = z.union([
	z.strictObject({ value: z.any(), add: z.string() }),
	z.strictObject({ value: z.any(), remove: z.string() }),
]);
const wgChangeSet = z
	.union([
		z.number(),
		z.tuple([z.number(), z.union([wgToken.array(), wgModification.array()])]),
	])
	.array();

export const layer = z.strictObject({
	name: z.string(),
	style: z.looseRecord(z.string(), z.string()),
	changeset: wgChangeSet,
});
export type Layer = z.output<typeof layer>;

export const richText = z.strictObject({
	type: z.literal("doc"),
	schema: z.literal(1),
	meta,
	content: wgNode,
	layers: layer.array(),
});
export type RichText = z.output<typeof richText>;

export const annotation = z.strictObject({
	type: z.literal("annotation"),
	schema: z.literal(1),
	meta,
	on: id,
	annotations: z
		.strictObject({
			pos: z.number(),
			length: z.number(),
			content: wgNode,
		})
		.array(),
});
export type Annotation = z.output<typeof annotation>;
