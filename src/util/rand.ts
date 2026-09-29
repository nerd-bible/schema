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

export const builtin64 = () => crypto.getRandomValues(new BigInt64Array(1))[0];
export const builtin63 = () => builtin64() & -2n;

// First 48 bits epoch ms, last 16 bits random
// Makes nice ordered ids for DB while storing the timestamp
export function tsid64(ts = new Date()): bigint {
	const res = new BigInt64Array(1);
	res[0] = BigInt(ts.getTime()) << 16n;
	const rand = crypto.getRandomValues(new Uint8Array(2));
	new Uint8Array(res.buffer).set(rand);
	return res[0];
}
