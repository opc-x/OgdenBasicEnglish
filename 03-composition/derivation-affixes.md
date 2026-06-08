# Affixes: extending the 850 without new roots

Ogden allows a fixed set of affixes. These do **not** count as new vocabulary — they are rules
applied to existing words. This is how 850 roots cover far more surface forms.

## Allowed affixes

| Affix | Applies to | Makes | Example |
|-------|-----------|-------|---------|
| **-S** | nouns | plural | `dog ? dogs` |
| **-ER** | ~300 nouns | agent / instrument / comparative | `work ? worker`, `print ? printer` |
| **-ING** | those nouns (as verb-like) | ongoing / gerund | `work ? working` |
| **-ED** | those nouns | past / participle / adjective | `work ? worked`, `paint ? painted` |
| **-LY** | qualities | adverb | `quick ? quickly` |
| **UN-** | qualities | opposite | `happy ? unhappy`, `kind ? unkind` |

## Degree (not -er/-est)

| Form | Pattern | Example |
|------|---------|---------|
| comparative | **MORE** + quality | more complex |
| superlative | **MOST** + quality | most complex |

## Spelling sub-rules

- sibilant endings: plural `-es` (`glass ? glasses`, `box ? boxes`)
- consonant + y: `-y ? -ies` (`story ? stories`)
- silent-e + -ING/-ED: drop e (`make ? making`)

## What is NOT allowed

- Arbitrary new suffixes (`-tion`, `-ment`, `-ize`) to coin words — use a listed noun instead.
- New verb roots — use operators.

## Agent note

Generate surface forms programmatically from the 850 roots + this affix set to build a
**recognition lexicon** (what BE850 text can legally contain). Keep root?form links for lookup.
