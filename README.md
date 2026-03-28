# schema

## Bible

The [canonical model](./src/typescript.ts) is a list of words with extra
dimensions in different structures.
[Doltlite](https://github.com/nerd-bible/doltlite) is used for querying and
version control.

## Mutations

Doltlite only stores diffs. To allow for better automatic merge resolution, I'm
thinking about storing an "operation" in the commit message:

Insert left/right
Join left/right (for deletes)
Split left/right
Update existing (not ID)
