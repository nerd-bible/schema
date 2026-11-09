export type Id = string; // uuidv4

export type Common = {
	id: Id;
	published: Date;
	lang: string;
	title?: string;
	authors?: string[];
	xrefs?: Id[];
	sources?: Id[];
};
export type Book = {
	type: "book";
	book: string;
};
export type Note = {
	type: "note";
};
export type Meta = Common & (Book | Note);
