# Free-first 4-week BE850 path

Uses only files in this repo + `manifest.json` remote links.

## Week 1 — Vocabulary map

- Read `corpus/vocabulary/words-ogden-order.md` daily (one category per day)
- Drill `corpus/vocabulary/basic-english-850.txt` (alphabetic flashcards)
- Optional: `downloads/ogdens-basic-english-850.pdf` on phone
- **Output**: JSONL `{word, category}` for all 850

## Week 2 — Operators + grammar

- Study `corpus/grammar/begr-1937.md`, then skim `begr-1937.html`
- Memorize 18 operators; practice compounds: `make + up`, `put + together`, `take + away`
- **Output**: compound table 50 rows

## Week 3 — Picture ? sentence

- Work through `downloads/english-through-pictures-book1.pdf` (Richards ETP)
- Restrict output vocabulary to BE850 where possible
- **Output**: 30 picture-description sentences using only 850 words

## Week 4 — Reading + extension

- Read Simple Wikipedia articles tagged Basic English
- Optional remote: [Bible in Basic English](https://archive.org/details/BBEFreePDFBibleinBasicEnglish) (~1000 words)
- **Output**: distill grammar FAQ from your errors log

## Agent distillation checklist

- [ ] `vocabulary.jsonl` — 850 entries with category
- [ ] `operators.jsonl` — 18 verbs + 100 common compounds
- [ ] `grammar_rules.jsonl` — from begr-1937
- [ ] `prompts/` — stage-specific system prompts for tutor agent
