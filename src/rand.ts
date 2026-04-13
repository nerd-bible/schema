import JSBI from "jsbi";
// export function toFloat64(low: number, high: number) {
//   const memory = new ArrayBuffer(8);
//   const arr = new Float32Array(memory);
//   arr[0] = low;
//   arr[1] = high;
//   return new Float64Array(memory)[0];
// }
//
// export const mulberry32 = (acc: number) => () => {
// 	let t = (acc += 0x6d2b79f5);
// 	t = Math.imul(t ^ (t >>> 15), t | 1);
// 	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
// 	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
// };
//
// export const mulberry32i = (acc: number) => {
// 	const rng = mulberry32(acc);
// 	return () => (rng() * 4294967296) >> 0;
// }

export const builtin32 = () => crypto.getRandomValues(new Int32Array(1))[0];
export const builtin64 = () =>
	new Float64Array(crypto.getRandomValues(new Int32Array(2)).buffer)[0];

export function builtin63(): JSBI {
	const buffer = crypto.getRandomValues(new Int32Array(2)).buffer;
	let res = JSBI.DataViewGetBigInt64(new DataView(buffer), 0);
	// shift instead of AND to preserve sign
	res = JSBI.signedRightShift(res, JSBI.BigInt(1));
	res = JSBI.leftShift(res, JSBI.BigInt(1));
	return res;
};
