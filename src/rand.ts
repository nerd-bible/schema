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
// 	return ((t ^ (t >>> 14)) >>> 0);
// };

export const builtin32 = () => crypto.getRandomValues(new Int32Array(1))[0];
export const builtin64 = () =>
	new Float64Array(crypto.getRandomValues(new Int32Array(2)).buffer)[0];

export function builtin63(): bigint {
	const values = crypto.getRandomValues(new BigInt64Array(1));
	return values[0] & -2n;
}
