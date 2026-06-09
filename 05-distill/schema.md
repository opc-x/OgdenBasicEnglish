# Agent 蒸馏 Schema（给程序用）

> 普通人学 BE850 **不用看本页**。这是从本仓库生成 JSONL / prompt 的规格说明。

## 1. vocabulary.jsonl（850 行）

```json
{"word": "dog", "class": "things_picturable", "tier": 2, "zh": "狗"}
{"word": "put", "class": "operations", "tier": 1, "role": "operator"}
{"word": "good", "class": "qualities_general", "tier": 4, "opposite": "bad"}
```

- `class`：operations | things_general | things_picturable | qualities_general | qualities_opposites
- `tier`：见 [`tier-guide.md`](../02-vocabulary/tier-guide.md)

## 2. operators.jsonl（约 120 行）

```json
{"base": "put", "particle": "together", "gloss": "assemble", "type": "phrasal"}
{"base": "make", "particle": "a decision", "gloss": "decide", "type": "operator_noun"}
```

## 3. grammar_rules.jsonl（约 10 行）

```json
{"id": "plural_s", "rule": "add -S for plural", "example": "dog→dogs", "exception": "glass→glasses"}
{"id": "degree", "rule": "use MORE/MOST not -er/-est", "example": "more complex"}
```

## 4. affixes.jsonl

```json
{"affix": "-er", "applies_to": "noun", "makes": "agent/instrument", "example": "work→worker"}
```

## 5. prompts/（系统提示词）

| 文件 | 用途 |
|------|------|
| `tutor.md` | 分阶段家教（骨架→词汇→组合） |
| `reducer.md` | 把任意英语改写成严格 BE850 |
| `validator.md` | 检查文本是否仍在 BE850 内 |

## 生成提示

- 词根来源：[`words-ogden-order.md`](../02-vocabulary/words-ogden-order.md)
- 规则来源：[`grammar-rules.md`](../01-foundations/grammar-rules.md)、[`03-composition/`](../03-composition/)
- 校验器需生成「识别用词典」（词根 × 允许词缀）
- 版权：[`copyright.md`](../reference/copyright.md)
