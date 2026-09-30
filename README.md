# schema

Schemas and models for versioned documents, their content, and span references.

## Formats
### Tree-based

[Wordgard](https://wordgard.net/docs/guide/#h-documents) models documents as
Plots which have content and Leaves that don't. Plots may contain block
elements OR inline lements, but not both.

This is the canonical format as it's easiest to read and write. Rich text
transforms and iteration are easily possible.

### Tabular

A shredded version of the tree-based model for querying documents where each
Plot is a row. Supports cross-referencing and audio. Lossless.

### [CoNLL-U](https://universaldependencies.org/format.html)

A sentence-tree format. Currently unsupported. Lossy.

### Publisher

[USFM](https://docs.usfm.bible/usfm/3.1.1/index.html) for publishing Biblical
documents. Currently unsupported. Lossy formatting.
