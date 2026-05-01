# html

Similar to [prosemirror-model](https://code.haverbeke.berlin/prosemirror/prosemirror-model), but:

1. Uses stable indices for content addressing
2. Smallest unit is a word instead of a character
3. `toDom` can return anything

## Why?

Stable indices allow for reading/writing document fragments. Otherwise
adding/removing content in a document requires mutating all successive
addresses.

For a schema like ours that:

1. Has large documents
2. Requires partial document rendering for search and annotation views
3. has MANY addresses for annotations

this wins over (version, pos) addressing. Generally for writing you want stable
indices and for reading you want relative indices. We use a B-Tree to sort our
stable indices for display.
