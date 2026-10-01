import type { Leaf, Plot } from "wordgard/doc";
// Sadly this is over 100x faster than crypto.digest shuffling.
// The bundle is half the size of hash-wasm which is only slightly faster.
import Sha256 from "jssha/dist/sha256";

export class Hasher {
	hash = new Sha256("SHA-256", "UINT8ARRAY");

	buffer(b: ArrayBuffer) {
		this.hash.update(b);
	}

	string(s: string) {
		const normalized = s.normalize("NFKC");
		this.hash.update(normalized);
	}

	number(n: number) {
		const encoded = new Float64Array(1);
		encoded[0] = n;
		return this.buffer(encoded.buffer);
	}

	boolean(b: boolean) {
		return this.number(b ? 1 : 0);
	}

	undefined() {
		return this.number(-1);
	}

	bigint(n: bigint) {
		return this.string(n.toString(36));
	}

	object(o: object) {
		if (o === null) return this.number(-2);

		const keys = Object.keys(o).sort();
		for (const k of keys) {
			this.string(k);
			this.any(o[k as keyof typeof o]);
		}
	}

	any(a: any) {
		if (Array.isArray(a)) {
			for (const e of a) this.any(e);
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
			case "function":
				return;
			case "symbol":
				return this.string(a.toString());
			default:
				throw Error("cannot hash " + a);
		}
	}

	// slower than `.string(JSON.stringify(doc.toJSON()))`
	wgNode(node: Plot | Leaf) {
		this.string(node.tag.name);
		this.any(node.tag.param);
		for (const m of node.marks) {
			this.string(m.name);
			this.any(m.value);
		}
		if (node.isPlot) {
			for (const c of node.content) {
				this.wgNode(c);
			}
		}
	}

	finish(): Uint8Array {
		return this.hash.getHash("UINT8ARRAY");
	}
}
