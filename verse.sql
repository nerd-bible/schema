WITH
	q (qdoc, qc, qv) AS (
		SELECT (SELECT doc FROM publication WHERE book='gen'), '2', '2'
	),
	c (cId) AS (
		SELECT id
		FROM word, q
		WHERE doc=qdoc AND lang='c' AND text=qc
	),
	v (vId) AS (
		SELECT id
		FROM word, q, c
		WHERE doc=qdoc AND lang='v' AND text=qv AND id > cId
		ORDER BY id
		LIMIT 1
	),
	end (eId) AS (
		SELECT id
		FROM word, q, v
		WHERE doc=qdoc AND lang IN ('c','v') AND id > vId
		ORDER BY id
		LIMIT 1
	)
SELECT w.*
FROM word w, q, c, v, end
WHERE doc=qdoc AND w.id > vId AND ifnull(w.id < eId, true)
