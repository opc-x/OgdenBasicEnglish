import { TRAINING_SENTENCES } from "../src/practice/trainingData";
import * as fs from "fs";
import * as path from "path";

// Candidates map for each operator+direction combo
const COMBO_CANDIDATES: Record<string, string[]> = {
  "put+on": ["穿", "戴", "挂", "盖", "涂", "贴", "踩", "铺", "放", "迈"],
  "put+off": ["推迟", "延迟", "脱", "关"],
  "put+out": ["熄灭", "扑灭", "关", "伸", "出版", "发表", "弄出", "扔出", "处理"],
  "put+up": ["挂", "升", "举", "建", "造", "提高", "架", "铺", "安排", "过夜", "进行", "抗争"],
  "put+down": ["放下", "放", "写下", "登记", "记", "写", "制止", "支付", "付", "踩"],
  "put+in": ["放", "插", "塞", "提出", "提交", "存入", "说好话", "装"],
  "put+through": ["穿", "接通", "执行", "完成", "通"],
  "put+together": ["组装", "拼", "整理", "汇总"],
  "put+over": ["盖", "铺", "撑", "捂", "放", "搭"],
  "take+off": ["脱", "起飞", "请假", "放假", "取下", "拿走", "剥", "削", "移开", "模仿", "取消"],
  "take+out": ["拿", "掏", "取", "带"],
  "take+in": ["吸收", "欺骗", "骗", "收留", "理解"],
  "take+up": ["开始", "占", "讨论", "接受", "拿起", "缩短"],
  "take+down": ["写", "记", "取下", "拆", "记录"],
  "take+over": ["接管", "接手", "接替", "掌管"],
  "take+back": ["收回", "拿回", "退回", "归还"],
  "take+away": ["带走", "拿走", "减去", "除去"],
  "go+in": ["进入", "进"],
  "go+out": ["出去", "退出", "熄灭"],
  "go+on": ["继续", "进行", "发生", "亮着"],
  "go+off": ["离开", "走开", "爆炸", "响起", "变质", "坏掉"],
  "go+up": ["上升", "涨价", "上涨", "升高"],
  "go+down": ["下降", "落", "沉", "减弱"],
  "go+back": ["返回", "回去", "回"],
  "go+through": ["穿过", "经历", "仔细检查", "检查", "翻阅", "通过"],
  "go+over": ["复习", "检查", "看"],
  "go+with": ["陪伴", "相配", "配"],
  "go+without": ["没有...也行", "没有", "挨饿", "将就"],
  "come+in": ["进入", "进来", "进"],
  "come+out": ["出来", "出现", "显露", "出版"],
  "come+back": ["返回", "回来", "回"],
  "come+up": ["接近", "上来", "被提出", "升起"],
  "come+down": ["下降", "下来", "落"],
  "come+through": ["经历", "安然度过", "传来", "透出"],
  "come+across": ["碰见", "遇见", "发现", "遭遇"],
  "get+up": ["起床", "站起来", "起来"],
  "get+in": ["进入", "进来", "进"],
  "get+out": ["出去", "离开", "泄露"],
  "get+off": ["下车", "下船", "下马", "动身", "离开"],
  "get+on": ["上车", "登上", "骑上", "穿上", "相处", "进展"],
  "get+back": ["返回", "回来", "拿回", "取回"],
  "get+through": ["通过", "完成", "用完", "接通"],
  "get+over": ["克服", "恢复", "度过"],
  "give+up": ["放弃", "投降", "让给"],
  "give+out": ["分发", "精疲力竭", "发出", "用完"],
  "give+back": ["归还", "还给", "还"],
  "give+off": ["发出", "散发", "释放"],
  "give+in": ["屈服", "让步", "递交", "交上来"],
  "make+up": ["整理", "铺", "发明", "编造", "弥补", "化妆", "和解", "组成"],
  "make+out": ["辨认", "看清", "理解", "写", "填写"],
  "make+for": ["走向", "走向...", "有利于"],
  "make+off": ["逃跑", "离开"],
  "keep+on": ["继续", "不停地"],
  "keep+off": ["不接近", "避开", "避"],
  "keep+up": ["保持", "坚持", "维护"],
  "keep+down": ["控制", "压低", "降低"],
  "keep+in": ["留校", "留在", "限制"],
  "keep+out": ["不让进入", "排除", "避开"],
  "send+out": ["发出", "派遣", "散发"],
  "send+off": ["寄出", "送行", "派遣"],
  "send+back": ["送回", "退回", "退"],
  "let+out": ["释放", "放出", "发出", "泄露"],
  "let+down": ["放下", "降下", "让失望", "失望"],
  "let+in": ["让进", "承认", "允许进入"],
  "let+off": ["免除", "原谅", "放过", "放走"],
  "see+through": ["看穿", "识破"],
  "see+to": ["负责", "处理", "照顾"],
  "see+off": ["送行", "送别", "送"],
  "have+on": ["穿着", "戴着", "穿", "戴"],
  "have+out": ["讨论", "解决"],
  "have+in": ["请入", "邀请"],
  "do+up": ["系", "包", "整理"],
  "do+with": ["相干", "与...有关", "需要"],
  "do+without": ["没有...也行", "将就", "放弃"],
  "do+over": ["重做", "重新装饰"],
  "come+over": ["过来", "来访", "袭击"],
  "send+for": ["派人去叫", "召唤", "索取"],
  "be+in": ["在", "进入", "在家"],
  "be+back": ["返回", "回来", "回"],
  "be+up": ["起床", "向上", "到期"],
  "go+about": ["着手", "做", "走动"],
  "go+after": ["追逐", "追求"],
  "put+about": ["传播", "宣传"],
  "put+across": ["解释", "表达"],
  "put+before": ["放在...前面", "优先"],
  "put+by": ["储存", "存"],
  "take+after": ["长得像", "像"],
  "take+apart": ["拆卸", "拆开"],
  "take+aside": ["拉到一边", "避开人"],
  "take+on": ["接受", "承担", "雇用", "呈"],
  "take+to": ["喜欢", "开始"],
  "come+along": ["同行", "随同", "进展"],
  "come+forward": ["挺身而出", "主动提供"],
  "come+on": ["来吧", "快点", "开始"],
  "come+off": ["脱落", "离开", "成功"],
  "come+about": ["发生", "产生"],
  "get+down": ["下来", "写下", "降低"],
  "get+about": ["走动", "传播"],
  "give+on": ["朝向"],
  "give+down": ["向下", "降下"],
  "give+over": ["交出", "停止"],
  "give+through": ["接通"],
  "give+about": ["传播"],
  "keep+back": ["隐瞒", "留步", "阻止"],
  "keep+over": ["延期"],
  "keep+through": ["维持"],
  "keep+about": ["身边保留"],
  "let+on": ["假装", "泄露"],
  "let+up": ["减弱", "减小"],
  "let+back": ["放回"],
  "let+over": ["让过"],
  "let+through": ["放行"],
  "let+about": ["允许走动"],
  "make+in": ["造"],
  "make+on": ["造"],
  "make+down": ["改小"],
  "make+back": ["返回"],
  "make+over": ["转让", "改造"],
  "make+through": ["通过"],
  "make+about": ["造"],
  "put+back": ["放回", "推迟"],
  "take+through": ["带过"],
  "take+about": ["带到各处"],
  "be+out": ["外出", "不在"],
  "be+on": ["在", "上演"],
  "be+off": ["离开", "动身"],
  "be+down": ["下降", "躺下"],
  "be+over": ["结束", "完了"],
  "be+through": ["完成", "结束"],
  "be+about": ["大约", "着手"]
};

// Normalize function for replacement verbs
function normalizeVerb(verb: string): string {
  if (verb === "穿上" || verb === "穿着") return "穿";
  if (verb === "戴上" || verb === "戴着") return "戴";
  if (verb === "脱下" || verb === "脱掉") return "脱";
  if (verb === "挂起" || verb === "挂在墙上" || verb === "挂在") return "挂";
  if (verb === "放下去" || verb === "放下" || verb === "放在") return "放";
  if (verb === "记下" || verb === "写下" || verb === "登记") return "写";
  if (verb === "铺在" || verb === "铺上") return "铺";
  if (verb === "涂在" || verb === "涂上") return "涂";
  if (verb === "贴在" || verb === "贴上") return "贴";
  if (verb === "掏出") return "掏";
  if (verb === "盖在" || verb === "盖上") return "盖";
  if (verb === "熄灭" || verb === "扑灭") return "熄灭";
  if (verb === "关掉") return "关";
  if (verb === "让进" || verb === "请入" || verb === "进入" || verb === "进来" || verb === "进去") return "进";
  if (verb === "送别" || verb === "送行") return "送";
  if (verb === "退回" || verb === "退回了") return "退";
  if (verb === "走向") return "走";
  if (verb === "骑上" || verb === "登上" || verb === "上车" || verb === "乘上") return "上";
  if (verb === "下车" || verb === "下船" || verb === "下马" || verb === "下来" || verb === "降下") return "下";
  if (verb === "归还" || verb === "还给") return "还";
  if (verb === "带走" || verb === "拿走") return "拿";
  return verb;
}

let changedCount = 0;
const updatedSentences = TRAINING_SENTENCES.map((s) => {
  if (s.step !== 1) return s;

  const key = `${s.operator}+${s.direction}`;
  const candidates = COMBO_CANDIDATES[key];
  if (!candidates) return s;

  let matched = "";
  for (const c of candidates) {
    if (s.zh && s.zh.includes(c)) {
      matched = c;
      break;
    }
  }

  if (matched) {
    const newVal = normalizeVerb(matched);
    if (newVal !== s.replaces) {
      console.log(`Update ID ${s.id}: "${s.sentence}" -> replaces changed from "${s.replaces}" to "${newVal}"`);
      changedCount++;
      return { ...s, replaces: newVal };
    }
  }
  return s;
});

console.log(`Total sentences updated: ${changedCount}`);

// Generate file content
const lines: string[] = [
  "// Auto-generated Ogden BE850 training data with Chinese translations",
  "export type TrainingSentence = {",
  "  id: number; step: number; type: string; sentence: string;",
  "  zh?: string; operator?: string; direction?: string;",
  "  noun?: string; replaces?: string; scene?: string; audio?: string;",
  "};",
  "",
  "export const TRAINING_SENTENCES: TrainingSentence[] = ["
];

for (const s of updatedSentences) {
  lines.push(`  ${JSON.stringify(s)},`);
}

lines.push("];");

fs.writeFileSync(
  path.resolve("src/practice/trainingData.ts"),
  lines.join("\n") + "\n",
  "utf8"
);
console.log("Successfully wrote updated trainingData.ts");
