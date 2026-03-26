// https://duckdb.org/docs/stable/sql/data_types/overview
export const document = `CREATE TABLE document (
	id INTEGER PRIMARY KEY,

	book TEXT, -- Biblical book, paratext id
	shortcode TEXT, -- publisher defined, like BSB, ESV, etc.
	code TEXT AS (book || '/' || shortcode),

	published INTEGER, -- unix epoch seconds
	publishedErrorRangeDays INTEGER
) STRICT;`;

export const word = `CREATE TABLE word (
	doc INTEGER REFERENCES document(id),
	id INTEGER, -- 70k ids = 43% collision chance for 32bit, 1.32e-10 for 64 bit

	before TEXT, -- punctuation
	text TEXT,
	lang TEXT, -- lowercase ISO 639
	after TEXT, -- punctuation

	-- stem AS userStemFn(lang, text)

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

	PRIMARY KEY (doc, word),
	FOREIGN KEY (doc, word) REFERENCES word(doc, id)
) STRICT, WITHOUT ROWID;
CREATE INDEX blockSegment ON block (tag, depth);`

export const span = `CREATE TABLE span (
	doc INTEGER,
	startWord INTEGER,
	endWord INTEGER,

	tag TEXT,
	data ANY,

	FOREIGN KEY (doc, startWord) REFERENCES word(doc, id),
	FOREIGN KEY (doc, endWord) REFERENCES word(doc, id)
) STRICT;
CREATE INDEX spanStartWord ON span (startWord);`
