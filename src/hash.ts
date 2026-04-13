const encoder = new TextEncoder();

export class Hasher {
	algo: string;
	hash = new ArrayBuffer();

	constructor(algo: string) {
		this.algo = algo;
	}

	async buffer(b: ArrayBuffer) {
		const digest = await crypto.subtle.digest(this.algo, b);
		const next = new Uint8Array(this.hash.byteLength + digest.byteLength);
		next.set(new Uint8Array(this.hash));
		next.set(new Uint8Array(digest), this.hash.byteLength);
		this.hash = await crypto.subtle.digest(this.algo, next);
	}

	async string(s: string) {
		const normalized = s.normalize("NFKC");
		const encoded = encoder.encode(normalized);
		return this.buffer(encoded.buffer);
	}

	async number(n: number) {
		const encoded = new Float64Array(1);
		encoded[0] = n;
		return this.buffer(encoded.buffer);
	}

	async boolean(b: boolean) {
		return this.number(b ? 1 : 0);
	}

	async undefined() {
		return this.number(-1);
	}

	async bigint(n: bigint) {
		return this.string(n.toString(36));
	}

	async any(a: any) {
		if (Array.isArray(a)) {
			for (const e of a) await this.any(e);
			return;
		}

		switch (typeof a) {
			case "string":
				return this.string(a);
			case "number":
				return this.number(a);
			case "bigint":
				return this.bigint(a);
			case "boolean":
				return this.boolean(a);
			case "object":
				return this.object(a);
			case "undefined":
				return this.undefined();
			default:
				throw Error("cannot hash " + a);
		}
	}

	async object(o: object) {
		if (o === null) return this.number(-2);

		const keys = Object.keys(o).sort();
		for (const k of keys) {
			await this.string(k);
			await this.any(o[k as keyof typeof o]);
		}
	}
}
