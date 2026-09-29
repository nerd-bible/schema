# schema

Schemas and models for versioned documents, their content, and span references.

## Formats
### Tree-based

[Wordgard](https://wordgard.net/docs/guide/#h-documents) uses a block and
inline layout of nodes. This is the canonical format as it's easiest to read
and write.

### Tabular

A shredded version of the tree-based model for querying documents. Supports
cross-referencing and audio.

#### Queries

1. [x] Partial document with chapters, verses, headings, and notes
2. [x] Search for words, including or excluding headings and notes
    - Order by canon
    - Context of min(sentence, n words)
3. [x] Find start and end of bc or bcv
4. [x] Lexicon
5. [x] Speaker quotes
6. Cross references
7. [x] Source of translated word
8. Source of source word (alignment)

### [CoNLL-U](https://universaldependencies.org/format.html)

A sentence-tree format. Currently unsupported.

### Publisher

[USFM](https://docs.usfm.bible/usfm/3.1.1/index.html) for Biblical documents.
