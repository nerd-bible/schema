SELECT
	id,
	lang,
	book,
	code,
	strftime('%Y-%m-%d', published, 'unixepoch') AS published,
	url
FROM doc
JOIN publication p ON p.doc=id;
