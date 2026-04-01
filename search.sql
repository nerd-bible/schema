-- word search with context
-- v1
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
			q AS (SELECT value FROM json_each('["god", "saw", "that", "he"]')),
			q2 (qlen) AS (SELECT count(*) - 1 FROM (SELECT * FROM q)),
			weights AS (
				SELECT
					stem,
					cast((SELECT count(*) FROM word) AS real) / count(*) AS weight
				FROM word
				INDEXED BY wordStem
				WHERE stem in (SELECT * FROM q)
				GROUP BY stem
			),
			needle (ndoc, nid) AS (
				SELECT doc, id
				FROM word
				WHERE stem IN (SELECT * FROM q)
			)
		SELECT
			doc,
			id,
			lag(id) OVER (PARTITION BY doc ORDER BY id) AS lid,
			count(*) AS relevance,
			before || text || after AS t
		FROM word w
		INDEXED BY wordStem
		JOIN q2
		JOIN needle ON (doc=ndoc AND id BETWEEN nid - qlen AND nid + qlen)
		GROUP BY doc, id
		ORDER BY doc, id
	)
)
GROUP BY streak
ORDER BY score DESC;

-- split by blocks, decided not to use
WITH
	blockSpans AS (
		SELECT
			doc,
			tag,
			word AS start,
			lead(word, 1, (SELECT max(id) FROM word)) OVER (PARTITION BY doc ORDER BY word) AS END
		FROM (
			SELECT
				doc,
				tag,
				word,
				lag(tag, 1, '') OVER (PARTITION BY doc ORDER BY word) AS prevTag
			FROM block
			WHERE tag NOT IN ('c', 'v') AND depth=1
			ORDER BY doc, word
		)
		WHERE prevTag != tag
	)
SELECT w.doc, w.id, b.tag, start, text
FROM word w
JOIN blockSpans b ON w.doc=b.doc AND w.id >= b.start AND w.id < b.end
WHERE b.tag IN ('h1', 'h2', 'h3', 'h4', 'h5', 'h6');

-- inverse word frequency
