const encoder = new TextEncoder();

export async function hashString(s: string) {
	return await crypto.subtle.digest("SHA-256", encoder.encode(s));
}

export async function hash(o: any) {
	const text = JSON.stringify(o);
	return await crypto.subtle.digest("SHA-256", encoder.encode(text));
}
