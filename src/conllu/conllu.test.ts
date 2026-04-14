import * as z from "@nerd-bible/valio";
import { test } from "node:test";
import expect from "expect";
import { normal } from "./io.ts";

function expectRoundtrip(doc: z.Output<typeof normal>, serialized: string) {
	const parsed = normal.decode(serialized);
	if (parsed.success) {
		expect(parsed.output).toEqual(doc);
	} else {
		expect(parsed.errors).toEqual([]);
	}

	const formatted = normal.encode(doc);
	if (formatted.success) {
		expect(formatted.output).toBe(serialized);
	} else {
		expect(formatted.errors).toEqual([]);
	}
}

test("basic", () => {
	expectRoundtrip(
		[
			{
				headers: { foo: "bar", sent_id: "some", text: "hello0" },
				words: [
					{
						id: "1",
						form: "hello0",
						lemma: "hello",
						upos: "PUNCT",
						xpos: "P",
						head: "1",
						deprel: "root",
						feats: { a: "b", b: "c" },
						deps: { 2: "dep1", 3: "dep2" },
						misc: { SpaceAfter: "No" },
					},
				],
			},
		],
		`# foo = bar
# sent_id = some
# text = hello0
1	hello0	hello	PUNCT	P	a=b|b=c	1	root	2:dep1|3:dep2	SpaceAfter=No`,
	);
});

test("ranges", () => {
	expectRoundtrip(
		[
			{
				headers: {
					sent_id: "Masoretic-Genesis-1:1-hbo",
					text: "בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃",
				},
				words: [
					{
						id: "1-2",
						form: "בְּרֵאשִׁ֖ית",
						lemma: "",
						upos: "",
						xpos: "",
						feats: {},
						head: "",
						deprel: "",
						deps: {},
						misc: { Translit: "bereʼshit" },
					},
				],
			},
		],
		`# sent_id = Masoretic-Genesis-1:1-hbo
# text = בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃
1-2	בְּרֵאשִׁ֖ית	_	_	_	_	_	_	_	Translit=bereʼshit`,
	);
});
