# schema

## Bible

The [canonical model](./src/typescript.ts) is a list of words with extra
dimensions in different structures.
[Doltlite](https://github.com/nerd-bible/doltlite) is used for querying and
version control.

## Mutations

Doltlite doesn't store diffs. To allow for better automatic merge resolution,
I'm thinking about storing an "operation" in the commit message:

Insert left/right
Join left/right (for deletes)
Split left/right
Update existing (not ID)

Moving words is still unsolved.

## Queries

1. [x] Partial document with chapters, verses, headings, and notes
2. Search for words, including or excluding headings and notes
    - Order by canon
3. [x] Find start and end of bc or bcv
4. [x] Lexicon
5. [x] Speaker quotes
6. Cross references
