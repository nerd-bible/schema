-- word search with context
SELECT
	max(relevance) as score,
	min(id) as start,
	max(id) as end,
	string_agg(t, '') as snippet
FROM (
	SELECT
		doc,
		id,
		t,
		relevance,
		sum(CASE WHEN lid IS NULL OR id < lid + 1 THEN 1 ELSE 0 END) OVER (ORDER BY doc, id) AS streak
	FROM (
		WITH
			q AS (SELECT value FROM json_each('["god", "saw", "that"]')),
			q2 (qlen) AS (SELECT count(*) - 1 FROM (SELECT * FROM q)),
			s (sdoc, sid) AS (
				SELECT doc, id
				FROM word
				WHERE stem IN (SELECT * FROM q)
			)
		SELECT
			doc,
			id,
			lag(id) OVER (PARTITION by doc ORDER BY id) AS lid,
			count(sdoc=doc AND id=sid) AS relevance,
			before || text || after AS t
		FROM word w
		JOIN q2
		JOIN s ON (doc=sdoc AND id BETWEEN sid - qlen AND sid + qlen)
		GROUP BY doc, id
		HAVING relevance > 1
		ORDER BY doc, id
	)
)
GROUP BY streak
ORDER BY score DESC;
