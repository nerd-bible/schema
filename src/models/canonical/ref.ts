import { Plot, Node, parse } from "wordgard/doc";
import * as z from "zod";

export const Refs = z.array(
	z.discriminatedUnion("type", [
		z.object({
			type: z.literal("path"),
			path: z.string(),
			start: z.int(),
			length: z.int(),
		}),
		z.object({
			type: z.literal("ref"),
			book: z.string(),
			chapter: z.int(),
			verse: z.string(),
		}),
	]),
);

export const Comment = Plot.Type.define<z.output<typeof Refs>>("Comment", {
	blockContent: Node.Group.Content,
	group: Node.Group.Block,
	shape: {
		element: "div",
		readElement(e) {
			const ref = JSON.parse(e.getAttribute("data-ref") ?? "");
			const parsed = Refs.safeParse(ref);

			return parsed.success ? parsed.data : parse.Reject;
		},
		attributes: (a) => ({ "data-ref": JSON.stringify(a) }),
	},
});
