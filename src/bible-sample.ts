import { semantic } from "./bible.ts";
import type { Node } from "prosemirror-model";

const { nodes, marks } = semantic;

const paragraphsText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed sem id mauris volutpat efficitur vitae vitae nunc. Cras condimentum vulputate ipsum id vulputate. Nullam dui neque, sagittis at sodales eget, malesuada nec lorem. Etiam vulputate lobortis porta. Sed id nisi leo. Vestibulum in mi erat. Nam porttitor lobortis leo, nec aliquam augue lacinia in. Vestibulum non enim odio. Sed mauris erat, vulputate nec dolor sit amet, blandit accumsan ipsum. Suspendisse eu orci posuere libero euismod sagittis. Curabitur non velit bibendum mi blandit pretium. Mauris tortor lectus, sodales nec aliquet sit amet, tristique et purus. Praesent mattis massa sed tellus tincidunt congue. Ut ac dapibus mi. Curabitur ornare aliquam sapien, nec pharetra libero lacinia eu.

Maecenas nec libero vel nibh aliquet ornare. Nulla eu orci nisl. Curabitur eu interdum lacus. Mauris scelerisque elementum nulla, vel finibus lorem varius et. Donec sit amet libero purus. Pellentesque posuere justo dui, vitae imperdiet urna accumsan in. Suspendisse semper sit amet mi vel ullamcorper. Aenean sit amet dictum urna, et sollicitudin ante. Nunc et dignissim mi. Cras fermentum justo in metus finibus tempor. Aliquam tellus tortor, porttitor a mauris a, vestibulum imperdiet elit. Cras cursus volutpat diam. Maecenas lacus lacus, vestibulum sit amet iaculis vestibulum, consequat vitae libero. Quisque varius congue aliquam. Sed id libero tincidunt, euismod mi vel, volutpat felis.

Donec sit amet porta orci. Sed id ante fringilla, efficitur libero id, molestie magna. Aliquam vestibulum, erat eu scelerisque hendrerit, orci felis ultricies arcu, eu blandit nisi enim in neque. Vivamus congue, nisl in lobortis dictum, mauris nibh congue justo, vitae fermentum sem mauris sit amet enim. Proin non sapien porta, ultricies magna ut, luctus justo. Pellentesque odio velit, mattis vitae finibus sed, condimentum quis ex. Morbi non urna convallis, ullamcorper ipsum pulvinar, porttitor sapien. Nam quis dolor neque. Curabitur sapien ipsum, dignissim eu quam ac, convallis congue mauris. Donec ut elementum mi, vitae volutpat enim. Quisque rhoncus tellus et rutrum porttitor. Fusce non dignissim nisi. Integer vel ullamcorper justo. Etiam vitae vehicula arcu, vitae tristique lectus. Vestibulum ornare dolor purus, et blandit ipsum scelerisque quis.

Pellentesque sagittis felis dolor, vitae suscipit justo finibus pulvinar. Pellentesque scelerisque orci eget tortor volutpat scelerisque. Praesent id arcu nec quam ultricies ultricies. Cras ac luctus sem. Suspendisse in nisl dapibus, tempor erat vehicula, auctor odio. Proin porta et ligula quis efficitur. Curabitur quis purus dolor. Nunc eu eleifend lacus, ut tincidunt ipsum. Sed elementum mollis erat. Quisque eu sem volutpat, dapibus tortor vitae, condimentum neque. Ut congue et nisl sed pretium. Fusce sed tempus velit, at ornare ipsum. Cras et viverra risus, id elementum tellus. Ut at dolor nibh.

Cras tortor ex, tincidunt ac ipsum a, porttitor congue magna. Proin nec hendrerit nunc, ac varius justo. Nulla nec risus nec dui mollis pretium eu et lectus. Vivamus convallis nibh eget arcu venenatis, vel luctus elit tincidunt. Maecenas est nisi, congue vel vestibulum ac, auctor a magna. Sed consectetur risus nec sem consequat, vel pulvinar massa aliquet. Nunc sollicitudin iaculis nulla a malesuada. Ut scelerisque eu turpis vel consequat. Morbi nec tristique diam. Ut nec tortor nec est iaculis vulputate. Nullam ex lacus, iaculis eget congue vel, accumsan id nibh. Curabitur sagittis ligula id arcu vehicula, nec elementum felis placerat.

Fusce laoreet, magna non vulputate auctor, nisl metus euismod ligula, et auctor mi massa ac enim. Nunc mattis, justo eu volutpat luctus, metus ipsum pretium mi, sit amet maximus lectus eros ut leo. Maecenas quis laoreet lorem. Ut pretium ex ut turpis sollicitudin, et aliquet mauris lacinia. In in tortor quam. Proin pretium feugiat felis vitae semper. Proin nec rutrum urna.

Pellentesque dapibus neque ac nunc tincidunt cursus. Curabitur enim justo, eleifend sit amet suscipit scelerisque, consequat eget mauris. Nam sed metus ipsum. Integer interdum nisl at orci interdum, et dictum velit congue. Aliquam erat volutpat. Nulla facilisi. Duis vel eros vel tortor laoreet porttitor. In ultricies orci ut ex pretium, iaculis aliquet mi laoreet. Etiam ac congue sapien. Duis vel pellentesque libero. Nulla volutpat pretium arcu et dictum.

Fusce non libero ac nisi maximus volutpat vitae eu massa. Praesent diam orci, placerat sit amet accumsan eu, fringilla nec nibh. Fusce vitae laoreet sapien, sed consequat enim. Praesent pharetra maximus mi, sed maximus augue viverra nec. Suspendisse risus purus, posuere non mi quis, ultricies vestibulum leo. Fusce lacus eros, pellentesque id interdum et, rutrum nec ipsum. Mauris facilisis, lacus eu malesuada imperdiet, augue metus fringilla mauris, eget dignissim ex diam varius leo. Nam id velit id enim volutpat tristique eget consectetur nulla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae consequat quam. Mauris posuere neque sagittis, sagittis lectus eget, blandit enim. Sed scelerisque mattis dui sed porta. Praesent eu vestibulum justo. Vestibulum suscipit urna porta mi pellentesque fringilla eu in ipsum. Nullam sed convallis odio.

Morbi bibendum faucibus dolor. Nullam et luctus velit. Cras non tempor leo. Maecenas et lectus dictum, sagittis est quis, volutpat augue. Integer aliquam nisi at lectus lobortis, eu fringilla diam malesuada. Sed tincidunt magna sem, quis posuere erat egestas ac. Integer tempus, arcu non cursus mollis, lorem libero imperdiet est, vulputate molestie elit magna vel velit. Nulla pulvinar, risus vitae convallis imperdiet, felis massa tincidunt velit, eu dignissim diam lectus eget neque. Suspendisse vitae suscipit ligula. Praesent a lacinia turpis, in viverra ipsum. Vivamus luctus erat vitae rutrum pharetra.

Aliquam erat volutpat. Etiam imperdiet rutrum euismod. Nulla enim dolor, aliquam non ultrices eget, ullamcorper quis elit. Fusce mi neque, fringilla in sapien ut, convallis imperdiet elit. Fusce sodales eleifend magna viverra efficitur. Sed tempor fermentum feugiat. Nunc gravida tincidunt urna. Curabitur et gravida nibh. Morbi bibendum est sit amet lacus suscipit iaculis. Cras vel varius lorem, ut sollicitudin nibh. Aliquam purus lacus, porta eget egestas eget, auctor a dolor. Maecenas pellentesque lacinia nunc a ultricies. Suspendisse potenti. Vivamus varius dui orci, a hendrerit magna porta in. Praesent at magna ut leo mollis tempor.

Nunc aliquam laoreet quam hendrerit maximus. Nullam pulvinar tellus in massa faucibus lobortis. In hac habitasse platea dictumst. Sed egestas luctus sapien quis maximus. Maecenas lobortis scelerisque.`;
let paragraphs = paragraphsText.split(/\n+/);
// for (let i = 0; i < 7; i++) paragraphs = paragraphs.concat(paragraphs);
const segmenter = new Intl.Segmenter("en", { granularity: "word" });

const wordSeperator = /[\p{Pc}\p{Pd}\p{Z}]+/u;
function isWordSeperator(text: string): Boolean {
	return text.match(wordSeperator) != null;
}

type Word = { before: string; text: string; after: string };
function toBeforeAfter(input: string): Word[] {
	const res: ReturnType<typeof toBeforeAfter> = [];
	let next: Word = { before: "", text: "", after: "" };

	for (const s of segmenter.segment(input)) {
		if (isWordSeperator(s.segment)) {
			res.push(next);
			next = { before: s.segment, text: "", after: "" };
		} else if (s.isWordLike) {
			next.text += s.segment;
		} else if (next.text) {
			next.after += s.segment;
		} else {
			next.before += s.segment;
		}
	}
	if (next.text) res.push(next);
	else {
		const punctAsWord = next.before || next.after;
		if (punctAsWord) res.push({ before: "", text: punctAsWord, after: "" });
	}

	return res;
}

let wId = 1;
function toWords(input: string): Node[] {
	const res: ReturnType<typeof toWords> = [];
	const words = toBeforeAfter(input);
	for (let i = 0; i < words.length; i++) {
		const w = words[i];
		if (i % 14 == 0) {
			if (verseNum >= 50) verseNum = 1;
			res.push(nodes.verseNum.create({ number: verseNum++ }));
		}
		res.push(
			semantic.text(w.before + w.text + w.after, [
				marks.word.create({
					id: wId++,
					before: w.before.length,
					after: w.after.length,
				}),
			]),
		);
	}
	return res;
}

let chapterNum = 1;
let verseNum = 1;
function toVerse(index: number): Node[] {
	const res: ReturnType<typeof toVerse> = [];
	const words = toWords(paragraphs[index]);
	for (let i = 0; i < words.length; i++) {
		res.push(words[i]);
	}
	return res;
}

const blocks = [];
for (let i = 0; i < paragraphs.length; i++) {
	if (i % 10 == 0) {
		blocks.push(
			nodes.heading.create(
				{ level: 2 },
				semantic.text((chapterNum++).toString()),
			),
		);
	}
	if (i % 5 == 0) {
		blocks.push(nodes.heading.create({ level: 3 }, toWords("A Heading")));
	}
	blocks.push(nodes.p.create(null, toVerse(i)));
}

export default nodes.doc.create({ id: "gen/en/bsb" }, blocks);
