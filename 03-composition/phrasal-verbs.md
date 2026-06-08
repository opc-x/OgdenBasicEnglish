# Phrasal verbs: operator + direction

This is the **engine** of Basic English. 18 operators × ~20 directions replace ~4,000 English verbs.
Build the verb you need instead of learning a new word.

## High-frequency build table

| Build | ? Standard verb |
|-------|-----------------|
| put together | assemble, build, combine |
| put off | postpone, delay |
| put on | wear, don |
| put out | extinguish, publish |
| put up | erect, raise |
| put away | store, tidy |
| put down | lower, write down |
| make up | invent, reconcile |
| make out | perceive, decipher |
| take off | remove, depart |
| take up | begin, occupy |
| take in | absorb, deceive |
| take over | assume control |
| take away | remove, subtract |
| get up | rise, wake |
| get off | dismount, leave |
| get on | proceed, board |
| get back | return, recover |
| get out | exit, escape |
| give up | surrender, quit |
| give in | yield |
| go on | continue, happen |
| go off | explode, leave |
| go through | endure, examine |
| go back | return |
| come in | enter |
| come out | emerge, appear |
| come back | return |
| keep on | persist |
| keep off | avoid |
| keep up | maintain |
| send out | distribute, emit |
| send off | dispatch |
| see through | discern, persevere |

## Noun-based verb replacement (the other technique)

When no operator+direction fits, use **operator + noun**:

| BE850 | ? Standard verb |
|-------|-----------------|
| give an answer | answer |
| make a decision | decide |
| have a look | look |
| give attention | attend |
| make a request | request |
| do work | work |
| have a desire | want |
| make a comparison | compare |

## For agents

Distill this into `operators.jsonl`:
```json
{"base": "put", "particle": "together", "gloss": "assemble", "register": "neutral"}
{"base": "make", "particle": "up", "gloss": "invent", "register": "neutral"}
```
Target ~120 high-frequency builds. Schema: `../05-distill/schema.md`.
