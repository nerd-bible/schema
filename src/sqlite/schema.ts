// Publication or note.
export const doc = `CREATE TABLE doc (
	id REAL PRIMARY KEY,
	lang TEXT -- ISO 639 used for sentence and default word segmentation
) STRICT, WITHOUT ROWID;`;
export const publication = `CREATE TABLE publication (
	id REAL PRIMARY KEY REFERENCES document(id),

	book TEXT NOT NULL, -- Biblical book, paratext id
	code TEXT NOT NULL, -- publisher defined, like BSB, ESV, etc.
	published INTEGER, -- unix epoch seconds
	url TEXT
) STRICT, WITHOUT ROWID;`;

// Document content.
// collision chance for 100k ids:
// 32 bit = .69
// 53 bit = 5.5e-7
// https://kevingal.com/apps/collision.html
export const word = `CREATE TABLE word (
	doc REAL REFERENCES document(id),
	id REAL,

	lang TEXT, -- ISO 639, NULL if same as document.lang
	text TEXT,

	PRIMARY KEY (doc, id)
) STRICT, WITHOUT ROWID;`;
export const grammar = `CREATE TABLE grammar (
	doc REAL,
	word REAL,

	-- conllu
	lemma TEXT,
	upos TEXT,
	xpos TEXT,
	feats BLOB,
	misc BLOB,

	PRIMARY KEY (doc, word),
	FOREIGN KEY (doc, word) REFERENCES word(doc, id)
) STRICT, WITHOUT ROWID;`;
export const source = `CREATE TABLE source (
	doc REAL,
	word REAL,

	srcDoc REAL CHECK (doc != srcDoc),
	srcWord REAL,

	PRIMARY KEY (doc, word, srcDoc, srcWord),
	FOREIGN KEY (doc, word) REFERENCES word(doc, id),
	FOREIGN KEY (srcDoc, srcWord) REFERENCES word(doc, id)
) STRICT, WITHOUT ROWID;`;

// Document layout.
// Blocks can nest and go BEFORE the word. Spans can span blocks.
export const block = `CREATE TABLE block (
	doc REAL,
	word REAL,

	tag TEXT NOT NULL,
	depth INTEGER NOT NULL,
	attrs BLOB,

	PRIMARY KEY (doc, word, tag),
	FOREIGN KEY (doc, word) REFERENCES word(doc, id)
) STRICT, WITHOUT ROWID;`;
export const span = `CREATE TABLE span (
	doc REAL,
	startWord REAL, -- inclusive
	endWord REAL, -- inclusive

	tag TEXT,
	data ANY,

	FOREIGN KEY (doc, startWord) REFERENCES word(doc, id),
	FOREIGN KEY (doc, endWord) REFERENCES word(doc, id)
) STRICT;`;

// Annotations.
export const docTag = `CREATE TABLE docTag (
	doc REAL REFERENCES doc(id),
	tag TEXT,
	value ANY,

	PRIMARY KEY (doc, tag)
) STRICT;`;
export const highlight = `CREATE TABLE highlight (
	id REAL PRIMARY KEY,

	name TEXT NOT NULL,
	backgroundColor TEXT,
	textDecoration TEXT
) STRICT, WITHOUT ROWID;`;
export const note = `CREATE TABLE anchor (
	id REAL PRIMARY KEY,

	doc REAL,
	word REAL,

	side INTEGER CHECK (side IN (0, 1)), -- 0 = left, 1 = right

	tag TEXT NOT NULL,
	data ANY,
	note REAL REFERENCES document(id), -- when tag == 'n'

	FOREIGN KEY (doc, word) REFERENCES word(doc, id)
) STRICT, WITHOUT ROWID;`;

// Search.
// This table is needed because:
// 1. Search uses a sequence algorithm that requires selecting adjacent words.
//    Making words adjacent requires a full table scan.
// 2. Words are mapped 0->N during normalization.
//
// This table should NOT be version controlled. Ideally it'd be a materialized
// view but SQLite doesn't support them.
export const wordSearch = `CREATE TABLE wordSearch (
	doc REAL,
	word REAL,
	wordEnd REAL, -- in case of N->1 mapping (i.e. one hundred ten -> 110)

	plane INTEGER, -- to group content
	pos INTEGER,
	stem TEXT,

	PRIMARY KEY (doc, word),
	FOREIGN KEY (doc, word) REFERENCES word(doc, id),
	FOREIGN KEY (doc, wordEnd) REFERENCES word(doc, id),
) STRICT, WITHOUT ROWID;`;
export const indices = [
	"CREATE INDEX spanStartWord ON span (startWord)",
	"CREATE INDEX spanEndWord ON span (endWord)",
	"CREATE INDEX wordSearchPos ON wordSearch (plane, pos)",
	"CREATE INDEX wordSearchStem ON wordSearch (plane, stem)",
];
