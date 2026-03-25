import * as z from "@nerd-bible/valio";

export const boolean = z.codecs.boolean({
	true: /yes|true/i,
	false: /no|false/i,
});

export function recordConllu(delims = { prop: "|", value: "=" }) {
	return z.codecs.custom(z.string(), z.record(z.string(), z.string()), {
		decode(value: string, ctx: z.Context) {
			let success = true;
			const output: Record<string, string> = {};

			for (const cur of value.split(delims.prop)) {
				// 14:nmod:into
				const index = cur.indexOf(delims.value);
				const k = index === -1 ? cur : cur.substring(0, index);
				if (!k) continue;

				output[k] = index === -1 ? "" : cur.substring(index + 1);
			}

			if (!success) return { success, errors: ctx.errors };
			return { success, output };
		},
		encode(v: Record<string, string>) {
			const entries = Object.entries(v);
			if (!entries.length) return { success: true, output: "_" };

			return {
				success: true,
				output: entries
					.map(([k, v]) => `${k}${delims.value}${v}`)
					.join(delims.prop),
			};
		},
	});
}

export const word = z.object({
	id: z.string(),
	form: z.string(),
	lemma: z.string(),
	upos: z.string(),
	xpos: z.string(),
	feats: recordConllu(),
	head: z.codecs.number(),
	deprel: z.string(),
	deps: recordConllu({ prop: "|", value: ":" }),
	//.pipe(z.record(z.codecs.number().gte(0), primitive)),
	misc: recordConllu(),
});
const columns = Object.keys(word.shape) as (keyof z.Output<typeof word>)[];

const wordConllu = z.codecs.custom(z.string(), word, {
	decode(v, ctx) {
		const split = v
			.split("\t")
			// spec is unclear what a missing _ means
			// the _ are there for readability in editors that don't show whitespace
			.map((v) => (v === "_" ? "" : v));

		const res = {} as any;
		for (let i = 0; i < columns.length; i++)
			res[columns[i] as (typeof columns)[number]] = split[i];

		return word.decode(res, ctx);
	},
	encode(value) {
		let output = "";
		for (const c of columns) {
			const v = value[c];
			if (v === "" || Number.isNaN(v)) output += "_";
			else {
				const encoded = word.shape[c].encode(v as never);
				if (!encoded.success) return encoded;
				output += encoded.output;
			}
			if (c !== "misc") output += "\t";
		}
		return { success: true, output };
	},
});

const headers = z.record(z.string(), z.union([z.string(), z.undefined()])).pipe(
	z
		.object({
			sent_id: z.string().minLength(1),
			text: z.string().minLength(1),
		})
		.loose(),
);

const headerPrefix = "#";
const headersConllu = z.codecs.custom(z.string(), headers, {
	decode(str: string, ctx: z.Context) {
		const kvs: Record<string, string | undefined> = {};
		const lines = str.split(/\r?\n/);
		for (let line of lines) {
			line = line.substring(headerPrefix.length);
			const i = line.indexOf("=");
			if (i === -1) {
				kvs[line.trim()] = undefined;
			} else {
				kvs[line.substring(0, i).trim()] = line.substring(i + 1).trim();
			}
			(ctx.jsonPath[0] as number) += 1;
		}
		return headers.decode(kvs);
	},
	encode(obj: z.Output<typeof headers>) {
		let output = "";
		for (const k in obj) {
			output += `# ${k}`;
			if (obj[k] != null) output += ` = ${obj[k]}`;
			output += "\n";
		}
		return { success: true, output };
	},
});

export const sentence = z.object({ headers, words: z.array(word) });
const sentenceConllu = z.codecs.custom(z.string(), sentence, {
	decode(str: string, ctx: z.Context) {
		const headersEnd = str.match(/^[^#]/m);
		const output: z.Output<typeof sentence> = {
			headers: {} as any,
			words: [],
		};
		if (headersEnd?.index) {
			const headerSection = str.substring(0, headersEnd.index - 1);
			str = str.substring(headersEnd.index);
			const decoded = headersConllu.decode(headerSection, ctx);
			if (!decoded.success) return decoded;
			output.headers = decoded.output;
		}
		const lines = str.split(/\r?\n/);
		for (const line of lines) {
			if (line) {
				const decoded = wordConllu.decode(line, ctx);
				if (!decoded.success) return decoded;
				output.words.push(decoded.output);
			}
			(ctx.jsonPath[0] as number) += 1;
		}

		return { success: true, output };
	},
	encode(sent: z.Output<typeof sentence>) {
		const h = headersConllu.encode(sent.headers!);
		if (!h.success) return h;
		let output = h.output;
		for (const w of sent.words!) {
			const encoded = wordConllu.encode(w);
			if (!encoded.success) return encoded;
			output += encoded.output;
			output += "\n";
		}
		return { success: true, output: output.trimEnd() };
	},
});

// Makes sure syntax is followed and required fields are included.
export const normal = z.codecs.custom(z.string(), z.array(sentence), {
	decode(str, ctx) {
		const output = [];
		const split = str.split(/\r?\n\r?\n/);
		ctx.jsonPath[0] = 1;
		for (const s of split) {
			const decoded = sentenceConllu.decode(s, ctx);
			if (!decoded.success) return decoded;
			output.push(decoded.output);
			ctx.jsonPath[0] += 2;
		}

		return { success: true, output };
	},
	encode(sentences, ctx) {
		let output = "";
		for (const s of sentences) {
			const encoded = sentenceConllu.encode(s, ctx);
			if (!encoded.success) return encoded;
			output += encoded.output;
			output += "\n\n";
		}

		return { success: true, output: output.trimEnd() };
	},
});
