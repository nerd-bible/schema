// const VerseNum: Leaf.Type<string> = Leaf.Type.define<string>("VerseNum", {
// 	inline: true,
// 	validate: (n) => {
// 		console.log("validate", n);
// 		if (!verseRegex.test(n))
// 			throw new ValidationError(`Unknown verse number: ${n}`);
// 	},
// 	shape: {
// 		structure(n) {
// 			console.log("hello", n);
// 			return Elt.mk("sup", [n]);
// 		},
// 	},
// 	parseRules: [
// 		{
// 			selector: "sup",
// 			readElement: (elt) => elt.textContent ?? parse.Reject,
// 		},
// 	],
// 	toText: (n) => (n as Leaf<string>).param + " ",
// });
//
// const verseWidget = Widget.define<string>({
// 	render(v) {
// 		const input = document.createElement("input");
// 		input.pattern = verseRegex.source;
// 		input.value = v;
// 		input.addEventListener("beforeinput", (event) => {
// 			const currentValue = event.target.value;
// 			const selectionStart = event.target.selectionStart;
// 			const selectionEnd = event.target.selectionEnd;
//
// 			// Get text to be inserted (handles typing and some pastes)
// 			let newText = event.data || "";
//
// 			// For paste events, dataTransfer may be needed if event.data is empty
// 			if (event.inputType === "insertFromPaste" && !newText) {
// 				newText = event.dataTransfer?.getData("text/plain") || "";
// 			}
//
// 			// Calculate the new value
// 			const newValue =
// 				currentValue.slice(0, selectionStart) +
// 				newText +
// 				currentValue.slice(selectionEnd);
//
// 			console.log("New projected value:", newValue);
//
// 			if (!verseRegex.test(newValue)) {
// 				console.log("stopit");
// 				event.preventDefault();
// 			}
// 		});
// 		const sup = document.createElement("sup");
// 		sup.append(input);
// 		return sup;
// 	},
// 	editable: true,
// 	propagateEvent: false,
// });
// const verseDeco = Decoration.Tag.shape(VerseNum, (v) =>
// 	verseWidget.of(v.param),
// );
