# schema

See the [canonical model](./src/typescript/schema.ts).

## Bible

[Doltlite](https://github.com/nerd-bible/doltlite) is used for querying and
version control.

## Mutations

Doltlite doesn't store diffs. To allow for better automatic merge resolution,
I'm thinking about doing small atomic commits and storing an "operation" in the
commit message:

Insert left/right
Join left/right (for deletes)
Split left/right
Update existing (not ID)

Moving words is still unsolved.

## Queries

1. [x] Partial document with chapters, verses, headings, and notes
2. Search for words, including or excluding headings and notes
    - Order by canon
    - Context of min(sentence, n words)
3. [x] Find start and end of bc or bcv
4. [x] Lexicon
5. [x] Speaker quotes
6. Cross references
7. [x] Source of translated word
8. Source of source word (alignment)
