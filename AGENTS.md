# Agent instructions — be850-distillery

Corpus for distilling **Ogden's Basic English (BE850)**: a 1930 simplified-English system using **850 core words** and **18 operator verbs**.

## What this repo is

- **Indexed** resource survey + **local mirrors** of free, agent-readable material
- **Not** a complete Ogden textbook dump (1930/1932 core books have no stable legal full-PDF)
- **Goal**: feed RAG / fine-tune / prompt distillation with structured vocabulary + grammar rules + pedagogy pointers

## Read first

1. `manifest.json` — file inventory and remote URLs
2. `corpus/vocabulary/words-ogden-order.md` — canonical 850-word taxonomy
3. `corpus/grammar/begr-1937.md` — grammar rules summary (full HTML in `corpus/grammar/begr-1937.html`)
4. `docs/survey-zh.md` — what's free vs borrow-only (Chinese)

## Distillation targets

| Layer | Source | Output idea |
|-------|--------|-------------|
| Lexicon | `words-ogden-order.md`, `basic-english-850.txt` | JSONL: `{word, category, operators_compatible}` |
| Grammar | `begr-1937.html` | Rule cards: plural, comparison, operators, compounds |
| Pedagogy | `docs/learning-path.md`, ETP PDF | Stage prompts: picture ? sentence ? operator compounds |
| Gaps | `manifest.json` ? `remote_only` | Fetch scripts or human borrow list |

## Operator verbs (18)

`come, get, give, go, keep, let, make, put, seem, take, be, do, have, say, see, send, may, will`

Complex verbs are built by composition: e.g. `put together` ? assemble, `make up` ? invent.

## Word categories (Ogden order)

1. **Operations** — 100 (verbs, pronouns, prepositions, conjunctions, adverbs)
2. **Things — general** — 400
3. **Things — picturable** — 200
4. **Qualities — general** — 100
5. **Qualities — opposites** — 50

## Copyright caution

- `begr-1937` pamphlet: originally marked no copyright; mirror OK for study
- Ogden 1930–1932 books: **do not** assume public domain globally; link-only in repo
- `downloads/*.pdf`: verify Archive.org / mirror terms before republishing

## Refresh corpus

```bash
./scripts/fetch.sh
```

## Do not confuse

- **Actor ??** (Jonathan Kos-Read) — unrelated; viral Douyin clips often mix Ogden BE850 with other creators
- **Betty Azar "Basic English Grammar"** — standard ESL grammar, **not** Ogden 850
- **??? / Chris Lonsdale** — different method (6-month / 5 principles)
