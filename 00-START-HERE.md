# Ogden Basic English (BE850) — Start Here

> 850 words + 18 operator verbs say ~90% of what we normally use 15,000–20,000 words for.
> C.K. Ogden, 1930. This repo organizes the system for **human study** and **agent distillation**.

## The one idea

Basic English is **not** "850 random common words." It is a **machine for building meaning**:

```
small word set  ×  combination rules  =  full expressive English
   (850 words)      (operators + affixes + compounds)
```

So you don't learn 850 words then "more words." You learn a **skeleton** (operators + directions),
then **slots** (nouns/qualities), then the **combination rules** that multiply them.

## Learning structure (folders = path)

| Step | Folder | What you build | Why first/last |
|------|--------|----------------|----------------|
| 1 | `01-foundations/` | 18 operators, directions, grammar rules | The skeleton of every sentence |
| 2 | `02-vocabulary/` | 850 words in priority tiers | The slots you fill |
| 3 | `03-composition/` | phrasal verbs, affixes, compounds | The multiplier — BE850's soul |
| 4 | `04-practice/` | picture?sentence, reading | Fluency in the constrained set |
| 5 | `05-distill/` | JSONL schemas + prompts | Output for RAG / fine-tune / tutor agent |
| ref | `reference/` | 1937 pamphlet, survey, mirrors | Sources & copyright |

## Core focus points (what actually matters)

1. **18 operators carry all action.** There are *no* other verbs. Master `get / give / go / make / put / take / come / keep / let / send / be / do / have / say / see / seem` + `may / will`. ? `01-foundations/operators-18.md`
2. **Operator + direction = phrasal verb.** `put together`=assemble, `make up`=invent, `take off`=remove. This replaces ~4,000 English verbs. ? `03-composition/phrasal-verbs.md`
3. **Five word classes, not a flat list.** Operations(100) · general things(400) · picturable things(200) · general qualities(100) · opposites(50). Learn picturable first (easiest), operations earliest (highest leverage). ? `02-vocabulary/tier-guide.md`
4. **Affixes extend, they don't add new roots.** `-S, -ER, -ING, -ED, -LY, UN-`, `MORE/MOST` for degree. ? `03-composition/derivation-affixes.md`
5. **Grammar = normal English minus the irregular verbs.** Output is indistinguishable from Standard English. ? `01-foundations/grammar-rules.md`

## Recommended path (4 weeks, free-only)

```
Week 1  Foundations
        01-foundations/operators-18.md      (memorize 18 + auxiliaries)
        01-foundations/directions-prepositions.md
        01-foundations/grammar-rules.md     (read once, keep as cheat sheet)

Week 2  Vocabulary — picturable + operations
        02-vocabulary/tier-guide.md  ? Tier 1 (operations) + Tier 2 (200 picturable)
        drill 02-vocabulary/basic-english-850.txt

Week 3  Composition (the multiplier)
        03-composition/phrasal-verbs.md      (build 100 operator+direction pairs)
        03-composition/derivation-affixes.md
        03-composition/compounds.md

Week 4  Vocabulary tail + practice
        02-vocabulary: 400 general things + 150 qualities
        04-practice/english-through-pictures-book1.pdf
        04-practice/reading-list.md  (Bible in Basic English, Simple Wikipedia)
```

## For agents

Read `AGENTS.md` then `manifest.json`. Distillation targets and JSONL schema live in `05-distill/schema.md`.
