import { RangeSet, Wordgard, menuBar } from "wordgard/editor";
import book from "../wordgard/book.ts";
import { history } from "wordgard/history";
import type { Leaf, Plot } from "wordgard/doc";
import { tokenize } from "../util/tokenize.ts";
import { Heading } from "../wordgard/common.ts";
import { VerseNum } from "../wordgard/verse.ts";
import { GardSelection, GardState } from "wordgard/state";
import { backgroundColor } from "wordgard/schema";
import { BackgroundColor } from "wordgard/types";
import { toTabular } from "../wordgard/toTabular.ts";

const html = `
<h2>1</h2>
<h3>The Creation</h3>
<sup>1</sup>In the beginning God created the heavens and the earth.

<sup>2</sup>Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.

<h3>The First Day</h3>

<sup>3</sup>And God said, “Let there be light,” and there was light.
<sup>4</sup>And God saw that the light was good, and He separated the light from the darkness.
<sup>5</sup>God called the light “day,” and the darkness He called “night.”

And there was evening, and there was morning—the first day.

<div class="line-group">
	<p><sup>27</sup>So God created man in His own image;</p>
	<p>in the image of God He created him;</p>
	<p>male and female He created them.</p>
</div>

<h3>The Fate of the Serpent</h3>
<p><sup>14</sup>So the LORD God said to the serpent:</p>
<blockquote>
	<p>
		“Because you have done this, cursed are you above all livestock and every
		beast of the field! On your belly will you go, and dust you will eat, all
		the days of your life.
		<sup>15</sup>And I will put enmity between you and the woman, and between
		your seed and her seed. He will crush your head, and you will strike his
		heel.”
	</p>
</blockquote>

<h3>The Covenant of the Rainbow</h3>
<p><sup>1</sup>And God blessed Noah and his sons and said to them,</p>
<blockquote>
	“Be fruitful and multiply and fill the earth.
	<sup>2</sup>The fear and dread of you will fall on every living creature on
	the earth, every bird of the air, every creature that crawls on the ground,
	and all the fish of the sea. They are delivered into your hand.
	<sup>3</sup>Everything that lives and moves will be food for you; just as I
	gave you the green plants, I now give you all things. <sup>4</sup>But you
	must not eat meat with its lifeblood still in it. <sup>5</sup>And surely I
	will require the life of any man or beast by whose hand your lifeblood is
	shed. I will demand an accounting from anyone who takes the life of his fellow
	man:
	<div class="poetry">
		<p>
			<sup>6</sup>Whoever sheds the blood of man, by man his blood will be
			shed;
		</p>
		<p>for in His own image God has made mankind.</p>
		<p><sup>7</sup>But as for you, be fruitful and multiply;</p>
		<p>spread out across the earth and multiply upon it.”</p>
	</div>
</blockquote>

<h2>12</h2>
<h3>The Call of Abram</h3>
<p>
	<sup>1</sup>Then the LORD said to Abram, “Leave your country, your kindred,
	and your father’s household, and go to the land I will show you.
</p>
<div class="poetry">
	<p><sup>2</sup>I will make you into a great nation, and I will bless you;</p>
	<p>I will make your name great, so that you will be a blessing.</p>
	<p>
		<sup>3</sup>I will bless those who bless you and curse those who curse you;
	</p>
	<p>and all the families of the earth will be blessed through you.”</p>
</div>
`;

const wg = Wordgard.create({
	parent: document.body.appendChild(document.createElement("div")),
	doc: html,
	config: [
		Wordgard.label("Editor"),
		book,
		history(),
		menuBar(),
		// Wordgard.transactionListener.of(transactions => {
		// 	for (const t of transactions) {
		// 		if (t.changes.empty) continue;
		// 		console.log("t", t.changes.toJSON());
		// 	}
		// }),
		// GardState.readOnly.of(true),
		// Wordgard.editable.of(false),
		// Wordgard.contentAttributes.of({ tabindex: "0" }),
	],
});
window.wg = wg;

const { doc } = wg.state;
const ranges: [number, number, number][] = [];
console.log(
toTabular(doc)
);
// let wordI = 0;
// const loadFactor = 0.8;
// const maxInt = BigInt("0x" + "F".repeat(16));

// doc.iterate(
// 	(node: Plot | Leaf, pos: number, parent: Plot | null, index: number) => {
// 		if (!node.isLeaf || !parent) return;
//
// 		if (parent.tag.is(Heading) && parent.tag.param == 2) {
// 		} else if (parent.tag.is(VerseNum.type)) {
// 		} else {
// 			console.log(node.param, parent!.tag);
// 			let wordStart = pos;
// 			for (const w of tokenize(node.param as string, "eng")) {
// 				const wLen = w.before.length + w.text.length + w.after.length;
// 				ranges.push([wordStart, wordStart + wLen, wordI++]);
// 				wordStart += wLen;
// 			}
// 		}
// 	},
// );


// const changes = ranges.map((r, i) => ({
// 	from: r[0],
// 	to: r[1],
// 	add: BackgroundColor.of(i % 2 ? "red" : "green"),
// }));
// wg.dispatch({ effects: GardState.appendConfig.of(backgroundColor()) });
// wg.dispatch({ changes });
