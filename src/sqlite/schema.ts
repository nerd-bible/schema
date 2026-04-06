// Publication or note.
export const doc = `CREATE TABLE doc (
	id INTEGER PRIMARY KEY,
	lang TEXT -- ISO 639 used for sentence and default word segmentation
) STRICT, WITHOUT ROWID;`;
export const publication = `CREATE TABLE publication (
	doc INTEGER PRIMARY KEY REFERENCES doc(id),

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
	doc INTEGER REFERENCES doc(id),
	id INTEGER,

	lang TEXT, -- ISO 639, NULL if same as doc.lang, not 3-letters if void tag
	text TEXT, -- if void tag is tag-dependent data

	PRIMARY KEY (doc, id)
) STRICT, WITHOUT ROWID;`;
export const grammar = `CREATE TABLE grammar (
	doc INTEGER,
	word INTEGER,

	-- conllu
	lemma TEXT,
	upos TEXT,
	xpos TEXT,
	feats BLOB CHECK (json_valid(feats)),
	misc BLOB CHECK (json_valid(misc)),

	PRIMARY KEY (doc, word),
	FOREIGN KEY (doc, word) REFERENCES word(doc, id)
) STRICT, WITHOUT ROWID;`;
export const source = `CREATE TABLE source (
	doc INTEGER,
	word INTEGER,

	srcDoc INTEGER CHECK (doc != srcDoc),
	srcWord INTEGER,

	PRIMARY KEY (doc, word, srcDoc, srcWord),
	FOREIGN KEY (doc, word) REFERENCES word(doc, id),
	FOREIGN KEY (srcDoc, srcWord) REFERENCES word(doc, id)
) STRICT, WITHOUT ROWID;`;

// Formatting and notes.
export const span = `CREATE TABLE span (
	doc INTEGER,
	start INTEGER, -- NULL = start of doc
	startSide INTEGER, -- 0 = left, 1 = right
	end INTEGER, -- NULL = end of doc
	endSide INTEGER, -- 0 = left, 1 = right

	tag TEXT,
	data ANY,

	FOREIGN KEY (doc, start) REFERENCES word(doc, id),
	FOREIGN KEY (doc, end) REFERENCES word(doc, id)
) STRICT;`;

// Annotations.
export const docTag = `CREATE TABLE docTag (
	doc INTEGER REFERENCES doc(id),
	tag TEXT,
	value ANY,

	PRIMARY KEY (doc, tag)
) STRICT;`;
export const highlight = `CREATE TABLE highlight (
	id INTEGER PRIMARY KEY,

	name TEXT NOT NULL,
	backgroundColor TEXT,
	textDecoration TEXT
) STRICT, WITHOUT ROWID;`;

// Search.
// This caching table is needed because:
// 1. Search uses a sequence algorithm that requires selecting adjacent words.
//    That normally requires a full table scan.
// 2. Words are mapped 0->N during normalization.
//
// This table should NOT be version controlled. Ideally it'd be a materialized
// view, but SQLite doesn't support them.
export const wordSearch = `CREATE TABLE wordSearch (
	doc INTEGER,
	word INTEGER,
	wordEnd INTEGER, -- in case of N->1 mapping (i.e. one hundred ten -> 110)

	plane INTEGER, -- to group content
	pos INTEGER,
	stem TEXT,

	PRIMARY KEY (doc, word),
	FOREIGN KEY (doc, word) REFERENCES word(doc, id),
	FOREIGN KEY (doc, wordEnd) REFERENCES word(doc, id)
) STRICT, WITHOUT ROWID;`;
export const wordSearchInvalid = `CREATE TABLE wordSearchInvalid (
	doc INTEGER PRIMARY KEY REFERENCES doc(id)
) STRICT;`;
export const triggers = `
CREATE TRIGGER wordInsert AFTER INSERT ON word
BEGIN
	INSERT INTO wordSearchInvalid (doc) VALUES (new.doc) ON CONFLICT DO NOTHING;
END;

CREATE TRIGGER wordDelete AFTER DELETE ON word
BEGIN
	INSERT INTO wordSearchInvalid (doc) VALUES (old.doc) ON CONFLICT DO NOTHING;
END;

CREATE TRIGGER wordUpdateText AFTER UPDATE ON word
BEGIN
	INSERT INTO wordSearchInvalid (doc) VALUES (new.doc) ON CONFLICT DO NOTHING;
END;

CREATE TRIGGER docUpdate AFTER UPDATE OF lang ON doc
BEGIN
	INSERT INTO wordSearchInvalid (doc) VALUES (new.doc) ON CONFLICT DO NOTHING;
END;
`;
export const indices = `
CREATE INDEX spanStart ON span (start);
CREATE INDEX spanEnd ON span (end);
CREATE INDEX wordSearchPos ON wordSearch (plane, pos);
CREATE INDEX wordSearchStem ON wordSearch (plane, stem);
`;
export const views = `
CREATE VIEW bcv AS
SELECT p.book as b, c.data as c, v.data as v, p.doc as doc, w.id, w.text
FROM word w
JOIN span c ON c.tag = 'c' AND c.doc = w.doc AND spanContains(c.start, c.startSide, c.end, c.endSide, w.id)
JOIN span v ON v.tag = 'v' AND v.doc = w.doc AND spanContains(v.start, v.startSide, v.end, v.endSide, w.id)
JOIN publication p ON p.doc = w.doc;
`;
