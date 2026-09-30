import * as wg from "wordgard/doc";
import * as schema from "./schema.ts";
import type { InferInsertModel } from "drizzle-orm";

type Tables = { [k in keyof typeof schema]?: InferInsertModel<typeof schema[k]>[] };

export function fromCanonical(doc: wg.Plot.Doc): Tables {
	const res = {
		doc: [],
		plots: [],
		changeSet: [],
	};
	return {};
}
