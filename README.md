# schema

Schemas and models for Biblical content and their notes.

Builders to create models. Editor to view and edit models.

Tests querying models.

Schemas:
- [x] Tabular: stored in relational database
- [ ] Editor: tree-based [Wordgard](https://wordgard.net/docs/guide/#h-documents)
- [ ] Academic: [CoNLL-U](https://universaldependencies.org/format.html).
- [ ] Bible publisher: [USFM](https://docs.usfm.bible/usfm/3.1.1/index.html)

## Converters
Every model can has converters to/from the editor model.

### Tabular
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
