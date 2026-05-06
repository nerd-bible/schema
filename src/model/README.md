# html

Similar to [prosemirror-model](https://code.haverbeke.berlin/prosemirror/prosemirror-model), but:

1. Uses stable indices for content addressing
2. Smallest unit is a word instead of a character
3. `toDom` is template for modern frameworks

## Why?

Stable indices allow for reading/writing document fragments. Otherwise
adding/removing content in a document requires mutating all successive
addresses.

For a schema like ours that:

1. Has large documents
2. Requires partial document rendering for search and annotation views
3. has a LOT of content that references others

this wins over (version, pos) addressing.

## Schema

### Inline

- Highlights
- Em, strong, short quotes
- Notes

### Block

- Paragraphs
- Long quotes
  - Can split first/last paragraphs
- Lists
  - Can split first/last paragraphs
- Outlines, which can split other blocks
