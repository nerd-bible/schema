import { Plot, Node, parse } from "wordgard/doc";
import * as z from "zod";

export const spanPos = z.object({ start: z.int(), length: z.int() });
export const spanBcv = z.object({
	book: z.string(),
	chapter: z.int(),
	verse: z.string(),
});
export const span = z.union([spanPos, spanBcv]);
export const ref = z.object({
	id: z.string(),
	version: z.string().optional(),
});

const refs = z.array(ref);
export const Comment = Plot.Type.define<z.output<typeof refs>>("Comment", {
	blockContent: Node.Group.Content,
	group: Node.Group.Block,
	shape: {
		element: "div",
		readElement(e) {
			const ref = JSON.parse(e.getAttribute("data-ref") ?? "");
			const parsed = refs.safeParse(ref);

			return parsed.success ? parsed.data : parse.Reject;
		},
		attributes: (a) => ({ "data-ref": JSON.stringify(a) }),
	},
});
