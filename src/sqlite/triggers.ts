// TODO: use or delete
const stemmed =
	"stemmer(ifnull(new.lang, (SELECT lang FROM document d WHERE d.id=new.doc)), new.text)";

export const triggers = `-- insert
CREATE TRIGGER wordInsert AFTER INSERT ON word
WHEN ${stemmed} IS NOT NULL
BEGIN
	UPDATE wordSearch SET pos = pos + 1 WHERE doc=new.doc AND word > new.id;
	INSERT INTO wordSearch (doc, word, pos, stem) VALUES (
		new.doc,
		new.id,
		(SELECT ifnull(max(pos), 0) + 1 FROM wordSearch WHERE doc=new.doc AND word < new.id),
		${stemmed}
	);
END;

-- delete
CREATE TRIGGER wordDelete AFTER DELETE ON word BEGIN
	DELETE FROM wordSearch WHERE doc=old.doc AND word=old.id;
	UPDATE wordSearch SET pos = pos - 1 WHERE doc=old.doc AND word > old.id;
END;

-- update
CREATE TRIGGER wordUpdateText AFTER UPDATE OF text ON word
WHEN ${stemmed} IS NOT NULL
BEGIN
	UPDATE wordSearch SET stem = ${stemmed} WHERE doc=new.doc AND word=new.id;
END;
CREATE TRIGGER wordUpdateTextNull AFTER UPDATE OF text ON word
WHEN ${stemmed} IS NULL
BEGIN
	DELETE FROM wordSearch WHERE doc=new.doc AND word=new.id;
	UPDATE wordSearch SET pos = pos - 1 WHERE doc=new.doc AND word > new.id;
END;
CREATE TRIGGER wordUpdateId AFTER UPDATE OF id ON word
WHEN ${stemmed} IS NOT NULL
BEGIN
	UPDATE wordSearch SET pos = pos - 1 WHERE doc=new.doc AND if(new.id > old.id, word>old.id, word<new.id);
	UPDATE wordSearch SET pos = pos + 1 WHERE doc=new.doc AND if(new.id > old.id, word>new.id, word<new.id);
	UPDATE wordSearch SET pos = (SELECT max(pos) + 1 FROM wordSearch WHERE doc=new.doc AND word < new.id) WHERE doc=old.doc AND word=old.id;
END;
CREATE TRIGGER documentUpdate AFTER UPDATE OF lang ON document
BEGIN
	UPDATE wordSearch SET stem = stemmer(ifnull(lang, new.lang), text) WHERE doc=old.doc;
END;
`;
