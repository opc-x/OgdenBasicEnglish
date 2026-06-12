# 任务：/practice/lab 改版 —— 风格统一 + Ogden 拼词造句机

仓库：`/Users/cuijianchen/Projects/OgdenBasicEnglish`（站点代码在 `site/`，Vite + React + react-router）
线上对照：
- 目标页 https://ogden-basic-english-omega.vercel.app/practice/lab
- 风格基准页 https://ogden-basic-english-omega.vercel.app/word/come

## 背景（主公原话拆解）

1. lab 页要与 word 详情页**前后风格统一**。
2. 交互要回归 **Ogden 核心方法论**：18 个 operator × 20 个方向词 × 850 候选词 = 拼词造句。
3. **借助模型生成能力**：组合例句（英文 + 中文翻译）由 AI 离线批量预生成，存为数据文件（参照 `site/src/practice/trainingData.ts` 的模式），不做运行时 API 调用。

## 关键文件

| 文件 | 作用 |
|------|------|
| `site/src/practice/OutputLabPage.tsx` | lab 页主体（5 个 tab：训练/拼句器/自由造句/降维改写/场景挑战） |
| `site/src/practice/SentenceBuilder.tsx` | 现有拼句器（词块无角色着色，候选词少） |
| `site/src/practice/be850Lexicon.ts` | BUILDER_CHIPS + analyzeSentence 合规校验 |
| `site/src/WordDetailPage.tsx` | 风格基准：eyebrow / 章节卡 / role 着色词块 / word-speak 按钮 |
| `site/src/wordGuides.ts` | ROLE_META（op/dir/n/adj/pron/conj/neg 七色体系） |
| `site/src/words850.ts` | 850 词全量数据（含分类 tier） |
| `site/src/operatorData.ts` | 18 operator 数据 |
| `site/src/styles.css` | word-detail 系列样式 ~1795 行起；lab 系列 ~4503 行起 |

## 改版要求

### A. 风格统一（对齐 word 详情页）
- header 用 word-detail 同款 eyebrow（`Ogden Basic English · …`）+ 标题层级。
- 所有词块/chips 按 ROLE_META 七色体系着色：operator、方向词、名词、性质词等颜色与 word 页例句解析完全一致，并展示同款图例（word-role-chip）。
- 朗读按钮统一用 word-speak 样式（不再混用 emoji 🔊 与文字按钮）。
- 章节卡、间距、字体节奏与 word-detail 各 section 一致。

### B. 拼句器升级为「拼词造句机」（核心交互）
1. 第一步选 operator（18 选 1，展示 OperatorVisual 小图标）。
2. 第二步选方向/介词（20 选 1，按该 operator 实际可组合的方向过滤）。
3. 第三步从 850 候选词里选宾语/补语，分类 pills 与 words 页一致：运作词 100 / 看得见 200 / 抽象 400 / 性质 100 / 反义 50，支持搜索。
4. 选完即出整句：role 着色 + 中文翻译 + Sonia 朗读 + `operator+dir = 替代的普通动词` 公式条（呼应首页 850×18×20 公式）。
5. 数据来源：预生成的组合句库（见 C），未命中组合时回退到模板拼接 + analyzeSentence 实时校验。

### C. 数据预生成（token 重活）
- 新文件 `site/src/practice/comboData.ts`：`{ operator, direction, word, sentence, zh, replaces }`。
- 覆盖：18 operator × 常用方向 × 每方向至少 10 个高频候选词（来自 850 词表，跨 5 个分类），总量 2000+ 句。
- 硬约束：每句必须 100% BE850 词表内（用 `analyzeSentence` 批量校验，score=100 才入库）；中文翻译必须是地道中文，不许机翻腔。
- 生成方式自选（脚本 + 你们自己的模型生成），参照 `scripts/` 下已有 gen_*.py 的套路。

## 分工

- **卧龙**：提案实现方案 → 写组件 + CSS + 数据接入（A + B）。
- **凤雏**：写数据生成与校验脚本，产出 comboData.ts（C）；同时批判卧龙的实现，重点盯风格一致性与移动端。
- **司马**：全程监督，按下面 AC 逐条验收，过了向主公复命，不过打回重做。

## AC / DoD

- AC1 风格统一：lab 页与 /word/come 同一视觉体系（eyebrow、role 七色、word-speak、章节卡）。
- AC2 拼词造句机：operator→方向→候选词 三步可用，出句带中文+朗读+公式条。
- AC3 数据：comboData.ts ≥2000 句，全部 analyzeSentence score=100。
- AC4 不破坏现有 5 个 tab 功能与路由。

## 验证

- **T1（机器）**：`cd site && npx tsc --noEmit && npm run build` 零错误；校验脚本输出 `2000+/2000+ pass, 0 fail`。
- **T2（AI 推理）**：截图对比 /practice/lab 与 /word/come，配色/字体/间距一致性置信度 ≥0.9；抽 30 句中文翻译无机翻腔。
- **T3（人工）**：主公浏览 /practice/lab 走完三步造句流程。

## 规矩

- 在 `/Users/cuijianchen/Projects/OgdenBasicEnglish` 直接干活，commit 信息按仓库现有风格（feat:/fix:/data:）。
- 卧龙先提案（≤150 字）→ 凤雏拆 → 司马放行后才动手写码。≤10 轮。
