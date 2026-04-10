import * as v from "@nerd-bible/valio";
import JSBI from "jsbi";

function primitive<T>(name: string, typeCheck: (v: any) => v is T) {
	return class extends v.Pipe<T, T> {
		get inputName() {
			return name;
		}
		inputTypeCheck(v: any) {
			return typeCheck(v);
		}

		get outputName() {
			return name;
		}
		outputTypeCheck(v: any) {
			return typeCheck(v);
		}
	};
}
export const ValioBigInt = primitive<JSBI>("jsbi", v => v instanceof JSBI);
export const bigint = () => new ValioBigInt();
