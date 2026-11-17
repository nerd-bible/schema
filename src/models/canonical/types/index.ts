import { Schema } from "wordgard/doc";
import * as book from "./book.ts";
import * as note from "./note.ts";

export { book, note };
export const bookSchema = Schema.define(Object.values(book));
export const noteSchema = Schema.define(Object.values(note));
