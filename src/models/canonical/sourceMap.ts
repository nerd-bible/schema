import * as z from "zod";

export const SourceMap = z.array(
	z.xor([
		z.int(), // skip
		z
			.array(z.int())
			.min(3) // fromLength, toStart, toLength, [toStart, toLength]...
			.refine((arr) => arr.length % 2 == 1, {
				message: "array must contain odd number of elements",
			}), // fromLength, toStart, toEnd
	]),
);
