# Agent instructions — OgdenBasicEnglish

Structured corpus for distilling **Ogden's Basic English (BE850)**: 1930 simplified English,
**850 core words** + **18 operator verbs**, extended by affixes and compounds.

## Read order

1. `00-START-HERE.md` — the system in one page + learning path
2. `manifest.json` — file inventory, remote links, distill targets
3. `01-foundations/` — operators, directions, grammar rules (the skeleton)
4. `02-vocabulary/words-ogden-order.md` — authoritative 850 taxonomy
5. `03-composition/` — phrasal verbs / affixes / compounds (the multiplier)
6. `reference/begr-1937.md` — Ogden's rationale (why verb-elimination)

## The model to keep in mind

```
850 roots  ×  (operators+directions, operator+noun, affixes, compounds)  =  everyday English
```
Do not treat BE850 as a flat word list. The combination rules in `03-composition/` are the point.

## Distillation targets ? `05-distill/schema.md`

| Artifact | From |
|----------|------|
| vocabulary.jsonl (850) | `02-vocabulary/words-ogden-order.md` |
| operators.jsonl (~120) | `03-composition/phrasal-verbs.md` |
| grammar_rules.jsonl | `01-foundations/grammar-rules.md` |
| affixes.jsonl | `03-composition/derivation-affixes.md` |
| prompts/ (tutor, reducer, validator) | whole corpus |

## Folder map

```
00-START-HERE.md      overview + path
01-foundations/       operators-18 · directions-prepositions · grammar-rules
02-vocabulary/        tier-guide · words-ogden-order(.md) · 850.txt · 850.pdf
03-composition/       phrasal-verbs · derivation-affixes · compounds
04-practice/          reading-list · english-through-pictures-book1.pdf
05-distill/           schema (jsonl + prompt targets)
reference/            begr-1937(.md/.html) · survey-zh · copyright · mirrors/
scripts/fetch.sh      refresh mirrors
```

## Copyright

- `begr-1937`: original no-copyright pamphlet; mirror OK for study.
- Ogden 1930–1932 textbooks: **not** assumed public domain; link-only (see `reference/copyright.md`).
- PDFs in repo: verify source terms before republishing.

## Do not confuse BE850 with

- Actor ?? / Jonathan Kos-Read — unrelated; viral clips mix him with BE850.
- Betty Azar "Basic English Grammar" — standard ESL, not Ogden.
- ??? / Chris Lonsdale "6 months" — different method.

## Deployment Guidelines

- **Automatic Production Deployment**: After any feature completion, bug fix, or UI refinement, the agent MUST run the deployment command (`npx vercel --prod --yes` in the root directory) to deploy the site to production. This ensures that the user can immediately perform online inspection and acceptance.

