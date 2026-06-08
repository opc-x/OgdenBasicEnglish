# Distillation schema — outputs for agents

Target artifacts to generate from this corpus for RAG / fine-tune / a BE850 tutor agent.

## 1. vocabulary.jsonl (850 rows)

```json
{"word": "dog", "class": "things_picturable", "tier": 2, "zh": "?"}
{"word": "put", "class": "operations", "tier": 1, "role": "operator"}
{"word": "good", "class": "qualities_general", "tier": 4, "opposite": "bad"}
```
- `class` ? operations | things_general | things_picturable | qualities_general | qualities_opposites
- `tier` per `../02-vocabulary/tier-guide.md`

## 2. operators.jsonl (~120 rows)

```json
{"base": "put", "particle": "together", "gloss": "assemble", "type": "phrasal"}
{"base": "make", "particle": "a decision", "gloss": "decide", "type": "operator_noun"}
```

## 3. grammar_rules.jsonl (~10 rows)

```json
{"id": "plural_s", "rule": "add -S for plural", "example": "dog?dogs", "exception": "glass?glasses"}
{"id": "degree", "rule": "use MORE/MOST not -er/-est", "example": "more complex"}
```

## 4. affixes.jsonl

```json
{"affix": "-er", "applies_to": "noun", "makes": "agent/instrument", "example": "work?worker"}
```

## 5. prompts/ (system prompts)

- `tutor.md` — staged tutor (foundations ? vocab ? composition)
- `reducer.md` — rewrite arbitrary English into strict BE850
- `validator.md` — check whether a text stays inside BE850 (roots + affixes + compounds)

## Build hints

- Source roots: `../02-vocabulary/words-ogden-order.md` (authoritative) and `basic-english-850.txt`.
- Grammar/affixes: `../01-foundations/grammar-rules.md`, `../03-composition/*`.
- Generate a **recognition lexicon** (roots × allowed affixes) for the validator.
- Keep provenance: cite Ogden 1930; see `../reference/copyright.md`.
