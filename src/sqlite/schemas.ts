export const document = `CREATE TABLE document (
	id INTEGER PRIMARY KEY,

	book TEXT, -- Biblical book, paratext id
	lang TEXT, -- ISO 639 used for segmentation
	shortcode TEXT, -- publisher defined, like BSB, ESV, etc.
	published INTEGER, -- unix epoch seconds
	publishedErrorRangeDays INTEGER,

	code TEXT AS (book || '/' || lang || '/' || shortcode)
) STRICT;`;

export const word = `CREATE TABLE word (
	doc INTEGER REFERENCES document(id),
	id INTEGER, -- 70k ids = 43% collision chance for 32bit, 1.32e-10 for 64 bit

	before TEXT, -- punctuation
	text TEXT,
	lang TEXT, -- ISO 639
	after TEXT, -- punctuation

	stem TEXT AS (stemmer(lang, text)),

	PRIMARY KEY (doc, id)
) STRICT, WITHOUT ROWID;`;

export const grammar = `CREATE TABLE grammar (
	doc INTEGER,
	word INTEGER,

	-- conllu fields
	lemma TEXT,
	upos TEXT,
	xpos TEXT,
	feats BLOB,
	misc BLOB,

	PRIMARY KEY (doc, word),
	FOREIGN KEY (doc, word) REFERENCES word(doc, id)
) STRICT, WITHOUT ROWID;`;

export const source = `CREATE TABLE source (
	doc INTEGER,
	word INTEGER,

	srcDoc INTEGER,
	srcWord INTEGER,

	FOREIGN KEY (doc, word) REFERENCES word(doc, id),
	FOREIGN KEY (srcDoc, srcWord) REFERENCES word(doc, id)
) STRICT;`;

// for sequences that cannot overlap
export const block = `CREATE TABLE block (
	doc INTEGER,
	word INTEGER,

	tag TEXT NOT NULL,
	depth INTEGER NOT NULL,
	attrs BLOB,

	PRIMARY KEY (doc, word, tag),
	FOREIGN KEY (doc, word) REFERENCES word(doc, id)
) STRICT, WITHOUT ROWID;`;

export const span = `CREATE TABLE span (
	doc INTEGER,
	startWord INTEGER,
	endWord INTEGER,

	tag TEXT,
	data ANY,

	FOREIGN KEY (doc, startWord) REFERENCES word(doc, id),
	FOREIGN KEY (doc, endWord) REFERENCES word(doc, id)
) STRICT;`;

export const indices = `CREATE INDEX spanStartWord ON span (startWord);
CREATE INDEX wordText ON word (text);
CREATE INDEX wordStem ON word (stem);`;
