// Porter's 1990 algorithm.
const step2Map: Record<string, string> = {
	ational: "ate",
	tional: "tion",
	enci: "ence",
	anci: "ance",
	izer: "ize",
	bli: "ble",
	alli: "al",
	entli: "ent",
	eli: "e",
	ousli: "ous",
	ization: "ize",
	ation: "ate",
	ator: "ate",
	alism: "al",
	iveness: "ive",
	fulness: "ful",
	ousness: "ous",
	aliti: "al",
	iviti: "ive",
	biliti: "ble",
	logi: "log",
};
const step2 = new RegExp("(" + Object.keys(step2Map).join("|") + ")$");
const step3Map: Record<string, string> = {
	icate: "ic",
	ative: "",
	alize: "al",
	iciti: "ic",
	ical: "ic",
	ful: "",
	ness: "",
};
const step3 = new RegExp("(" + Object.keys(step3Map).join("|") + ")$");

const consonants = "([^aeiou][^aeiouy]*)";
const vowel = "[aeiouy]";
const vowels = "(" + vowel + "[aeiou]*)";

const gt0 = new RegExp("^" + consonants + "?" + vowels + consonants);
const eq1 = new RegExp(
	"^" + consonants + "?" + vowels + consonants + vowels + "?$",
);
const gt1 = new RegExp("^" + consonants + "?(" + vowels + consonants + "){2,}");
const vowelInStem = new RegExp("^" + consonants + "?" + vowel);
const consonantLike = new RegExp("^" + consonants + vowel + "[^aeiouwxy]$");

const suffixes = {
	ll: /ll$/,
	e: /^(.+?)e$/,
	y: /^(.+?)y$/,
	ion: /^(.+?(s|t))(ion)$/,
	edOrIng: /^(.+?)(ed|ing)$/,
	atOrBlOrIz: /(at|bl|iz)$/,
	eED: /^(.+?)eed$/,
	s: /^.+?[^s]s$/,
	ssesOrIes: /^.+?(ss|i)es$/,
	multiConsonantLike: /([^aeiouylsz])\1$/,
};
const step4 =
	/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;

const stopWords = new Set([
	"a",
	"an",
	"and",
	"the",
	"of",
	"at",
	"in",
]);

export default function english(value: string): string | null {
	let result = value.toLowerCase().replace(/\p{P}|\p{Z}/gv, "");
	if (stopWords.has(result)) return null;
	if (result.length < 3) return result;

	// leading y shouldn't match regexes
	if (result[0] === "y") result = "Y" + result.slice(1);

	// Step 1a.
	if (suffixes.ssesOrIes.test(result)) result = result.slice(0, -2);
	else if (suffixes.s.test(result)) result = result.slice(0, -1);

	// Step 1b.
	let match: RegExpMatchArray | null;
	if ((match = suffixes.eED.exec(result))) {
		if (gt0.test(match[1])) result = result.slice(0, -1);
	} else if (
		(match = suffixes.edOrIng.exec(result)) &&
		vowelInStem.test(match[1])
	) {
		result = match[1];

		if (suffixes.atOrBlOrIz.test(result)) {
			result += "e";
		} else if (suffixes.multiConsonantLike.test(result)) {
			result = result.slice(0, -1);
		} else if (consonantLike.test(result)) {
			result += "e";
		}
	}

	// Step 1c.
	if ((match = suffixes.y.exec(result)) && vowelInStem.test(match[1]))
		result = match[1] + "i";

	// Step 2.
	if ((match = step2.exec(result)) && gt0.test(match[1]))
		result = result.substring(0, match.index) + step2Map[match[1]];

	// Step 3.
	if ((match = step3.exec(result)) && gt0.test(match[1]))
		result = result.substring(0, match.index) + step3Map[match[1]];

	// Step 4.
	if ((match = step4.exec(result))) {
		if (gt1.test(match[1])) result = match[1];
	} else if ((match = suffixes.ion.exec(result)) && gt1.test(match[1]))
		result = match[1];

	// Step 5.
	if (
		(match = suffixes.e.exec(result)) &&
		(gt1.test(match[1]) ||
			(eq1.test(match[1]) && !consonantLike.test(match[1])))
	)
		result = match[1];

	if (suffixes.ll.test(result) && gt1.test(result))
		result = result.slice(0, -1);

	// Turn initial `Y` back to `y`.
	if (result[0] === "y") result = "y" + result.slice(1);

	return result;
}
english.version = 1;
