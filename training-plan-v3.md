# 🎯 Ogden BE850 训练系统方案 v3

> 军师联盟三人合议 · 司马终裁 · 一案到底

---

## 一、方法论核心（先搞清练什么）

Ogden 不是「背 850 个单词」，是**训练翻译引擎**：

```
850 词（词汇池）× 18 operator × 20 方向 × 名词组合 = 日常英语
```

**五条规则：**
1. **消灭普通动词** — enter → go in，decide → make a decision
2. **Operator × 方向 = 短语动词** — 16 operator × 20 方向 ≈ 替代 4000+ 动词
3. **850 词分层** — 看得见的先学（200），抽象的再学（400）
4. **词缀不占词根** — -s/-er/-ing/-ed/-ly/un-/more/most
5. **输出和正常英语没区别** — 不是机器人英语

**缩减学习时间的本质：** 不是「只学 850 个词就够了」，而是「学会用 18 个 operator 搭配方向/名词来替代 4000+ 动词」——这才是那个缩短学习时长的底层逻辑。

---

## 二、训练层级（用户看到的四个标签页）

```
L1 · 动作替换 ──→ L2 · 抽象替换 ──→ L3 · 句子改写 ──→ L4 · 场景实战
   (operator+direction)    (operator+noun)      (整句 BE850 化)    (自由约束输出)
```

### L1 · 动作替换
**练什么：** 普通动词 → operator + 方向

| 看到 | 你要输出 |
|------|---------|
| enter | go in / come in |
| postpone | put off |
| remove | take off / take away |
| continue | go on |
| arrive | come to / get to |

**数据量：** ~100 组高频映射（已有 `03-composition/phrasal-verbs.md` 做数据源）
**用户操作：** 看到普通动词 → 输入 BE850 等价表达式 → 实时检查 → 正确/接近/错误
**间隔重复：** SM-2 引擎安排下次复习时间

### L2 · 抽象替换
**练什么：** 普通动词 → operator + 名词

| 看到 | 你要输出 |
|------|---------|
| decide | make a decision |
| want | have a desire (for) |
| compare | make a comparison |
| help | give help |
| think | have thoughts |

**数据量：** ~80 组高频映射（已有 `03-composition/phrasal-verbs.md` 第二部分做数据源）
**用户操作同 L1**

### L3 · 句子改写
**练什么：** 完整普通英语句子 → BE850 版

| 看到 | 你要输出 |
|------|---------|
| I decided to enter the room. | I made a decision to go into the room. |
| She removed her coat. | She took her coat off. |
| They continued working. | They went on with work. |

**数据量：** 50+ 条（已有 8 条降维改写，需扩充）
**用户操作：** 看到原句 → 改写 → SentenceAuditor 实时标色（绿色合规/紫色 operator/红色超纲）→ 提交对照官方范例

### L4 · 场景实战
**练什么：** 仅用 BE850 词描述一个现实场景

**场景举例：** 去医院 / 点餐 / 自我介绍 / 问路 / 描述房间 / 讲天气 / 购物 / 打电话 / 约会

**数据量：** 20+ 场景（已有 6 个，需扩充）
**用户操作：** 看到场景中文提示 → 写 2-3 句 BE850 → 实时合规检测 → 看官方示范对比

---

## 三、用户 30 天旅程（怎么看到效果）

```
Day 1  ─ 做 L1 前 10 组动作替换，打卡激活
Day 3  ─ L1 复习队列启动（SM-2 自动安排），命中率 60%→ 看到「记住了」
Day 7  ─ L1 命中率 85%+，L2 抽象替换解锁，连续打卡 7 天
Day 14 ─ L1 命中率 90%+，L2 命中率 70%+，L3 句子改写解锁
Day 21 ─ L3 合规率从 40% → 70%，L4 场景实战解锁
Day 30 ─ L1 100 组全部 Master，L3 合规率 85%+，5 个场景能独立输出合规句
```

**每完成一个里程碑，仪表盘弹出：**
- 「你的翻译引擎已覆盖 30% 日常动词」
- 「你已经可以描述 3 个日常场景了」
- 「L1 映射 90% Master，相当于替代了 ~3500 个普通动词」

---

## 四、技术实现（具体怎么码）

### 4.1 数据层：indexedDB（替代现有 localStorage）

```
┌─────────────────┐
│   mappingState  │  ← 每条映射的 SM-2 状态
│   {id, EF,      │     例: "enter" → "go in"
│    interval,    │     状态: {EF: 2.5, interval: 6, nextReview: "2026-06-17"}
│    nextReview,   │
│    lastResult}   │
├─────────────────┤
│   sessionLog    │  ← 每次训练记录
│   {ts, type,    │     例: type="L1", accuracy=0.8, tested=20, duration=180
│    accuracy,     │
│    tested}       │
├─────────────────┤
│   userProfile   │  ← 聚合指标（实时计算，非独立快照）
│   {streak,       │     从 mappingState + sessionLog 实时算出
│    lastActive}    │
└─────────────────┘
```

**迁移：** `migrateProgress()` 脚本——检测 localStorage 旧格式 `ogden-practice:*` → 批量写入 indexedDB → 标记已迁移 → 旧 key 保留不删

### 4.2 SM-2 引擎（前端纯 JS）

```
认识     → interval = interval × EF（增长间隔）
不确定   → interval = max(1, interval × 0.5)（减半）
不认识   → interval = 1, EF = EF - 0.15（重置间隔，微降 EF）
```

只对 L1+L2 映射做 SRS。L3+L4 是场景练习，不进入 SRS 队列。

### 4.3 前端组件（在现有 site/ 上增量改）

```
site/src/practice/
  ├── be850Lexicon.ts        (已有，不动)
  ├── SentenceAuditor.tsx     (已有，不动)
  ├── SentenceBuilder.tsx     (已有，不动)
  ├── OutputLabPage.tsx       (改造——L1/L2/L3/L4 四标签替换现有四标签)
  ├── OperatorDrill.tsx       (新增——L1+L2 训练界面)
  ├── RewriteDrill.tsx        (新增——L3 句子改写 + 同页 SRS 复习)
  ├── ScenarioDrill.tsx       (新增——L4 场景实战)
  ├── TrainingDashboard.tsx   (新增——首页每日训练计划)
  ├── ProgressDashboard.tsx   (新增——掌握度仪表盘)
  ├── srsEngine.ts            (新增——SM-2 算法)
  ├── mappingData.ts          (新增——L1 100组 + L2 80组映射数据)
  ├── scenarioData.ts         (改造——从 6 扩展到 20+ 场景)
  ├── rewriteData.ts          (改造——从 8 扩展到 50+ 改写题)
  └── indexedDB.ts            (新增——Store 初始化 + 读写封装)
```

### 4.4 路由（在 App.tsx 追加）

```
/                    → 首页（改为 TrainingDashboard）
/practice/lab        → Output Lab（L1/L2/L3/L4 四标签）
/practice/progress   → 掌握度仪表盘
/doc/:slug           → 文档（不动）
/words               → 词表（不动）
```

---

## 五、开工顺序（照着这个码）

| 序号 | 内容 | 文件 | 工期 |
|------|------|------|------|
| 1 | `indexedDB.ts` + 迁移脚本 | 新建 | 先做 |
| 2 | `srsEngine.ts` SM-2 算法 | 新建 | 接着 |
| 3 | `mappingData.ts` L1+L2 映射数据 | 从 phrasal-verbs.md 提取 | 数据准备 |
| 4 | `OperatorDrill.tsx` L1+L2 训练界面 | 新建 | 核心 UI |
| 5 | `TrainingDashboard.tsx` 每日计划 | 新建 | 首页 |
| 6 | 扩充 `rewriteData.ts` 到 50+ | 改造 | 内容 |
| 7 | `RewriteDrill.tsx` L3 改写 + SRS | 新建 | UI |
| 8 | 扩充 `scenarioData.ts` 到 20+ | 改造 | 内容 |
| 9 | `ScenarioDrill.tsx` L4 场景实战 | 新建 | UI |
| 10 | `ProgressDashboard.tsx` | 新建 | 最后 |

---

## 六、验收标准（怎么知道做对了）

- [ ] 用户打开首页 → 看到今日训练任务（L1 复习 N 条 + L2 新学 N 条 + 1 句改写）
- [ ] L1 训练：看到 `enter` → 输入 `go in` → 显示 ✓ 正确 → 下次复习间隔自动计算
- [ ] L3 改写：输入句子 → SentenceAuditor 实时标色 → 合规率 ≥80% 弹 ✓
- [ ] L4 场景：「点餐」→ 写 2 句 BE850 → 合规检测 → 看官方示范对比
- [ ] 进度仪表盘：L1 映射掌握率曲线 + L3 合规率趋势 + 连续打卡天数
- [ ] 第 7 天用户：L1 命中率 ≥85%，累计覆盖 50+ 组映射，等价替代 ~2000 个普通动词
- [ ] 数据迁移：旧 localStorage 进度不丢

---

## 七、不做（防止跑偏）

- ❌ 不做「单词→释义」SRS 翻牌（那不是 Ogden）
- ❌ 不做语音识别（这期不做，后加）
- ❌ 不做 GPT 辅助造句（会被滥用来规避训练）
- ❌ 不做后端/Social/排行榜
- ❌ 850 词表本身保持不变——它是词汇池，训练对象是映射引擎

---

> **本方案替代之前所有分散的 Issue。下一步：三人确认→主公批→按开工顺序码。**
