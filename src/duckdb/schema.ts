// https://duckdb.org/docs/stable/sql/data_types/overview
export const duckdb = `
create table document (
	id string primary key check (length(split(id, '/')) == 3),
	name string,
	published date,
	publishedErrorRangeDays uinteger,

	book as (split(id, '/')[1]),
	lang as (split(id, '/')[2]),
	shortcode as (split(id, '/')[3])
);
comment on table document is 'something readable, usually a Biblical book';
comment on column document.book is 'usually paratext id';
create table word (
	doc string,
	sent usmallint,
	id float8,
	foreign key (doc, sent) references sentence(doc, id),
	primary key(doc, sent, id),
	position usmallint,

	before string, -- punctuation
	text string,
	after string, -- punctuation

	type string,
	form string,
	lemma string,
	upos string,
	xpos string,
	feats map(string, string),
	head usmallint,
	deprel string,
	deps map(string, string),
	misc map(string, string),

	chapter as misc['chapter'],
	sentence int,
	verse as misc['verse']
);
comment on column word.id '70k ids = 43% collision chance for 32bit, 1.32e-10 for 64 bit. float8 chosen for best JS interop'

create table span (
	docId string,
	startWordId float8,
	endWordId float8,
	tag string,
	data string
);
`;
