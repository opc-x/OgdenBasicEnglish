import { TRAINING_SENTENCES } from "../src/practice/trainingData";

const step1 = TRAINING_SENTENCES.filter(s => s.step === 1);

const VERBS = [
  "推迟", "延迟", "取消", "起飞", "脱掉", "脱下", "穿上", "戴上", "挂起", "升起", "举起", "提高", "降低", "放下", "写下", "记下", "登记", "组装", "拼好",
  "熄灭", "扑灭", "关掉", "闭嘴", "捂住", "盖上", "铺上", "涂上", "贴上", "剥掉", "请假", "休假", "拿开", "移开", "抽出", "掏出", "掏", "取出", "提取",
  "吸收", "欺骗", "骗取", "接管", "接手", "承担", "喜欢", "适应", "收回", "退回", "拿回", "带走", "拿走", "拿", "放", "挂", "穿", "戴", "脱", "贴",
  "涂", "抹", "盖", "铺", "踩", "踏", "抱", "抬", "搬", "移", "送", "递", "传", "寄", "提", "提议", "提交", "伸", "展", "举", "升", "建", "涨",
  "压制", "压低", "插", "塞", "进", "放入", "穿过", "越过", "跨过", "钻过", "进入", "进去", "出来", "出去", "出现", "露出", "继续", "进行", "发生",
  "响起", "发射", "爆炸", "变质", "腐烂", "上升", "涨价", "倒塌", "坠落", "落下", "降落", "返回", "回去", "经历", "遭遇", "忍受", "翻阅", "仔细检查",
  "检查", "复习", "陪伴", "伴随", "适合", "顺从", "放弃", "缺少", "志愿", "挺身而出", "上马", "骑上", "登上", "下马", "下车", "下船", "搞定", "克服",
  "度过", "撑过去", "投降", "屈服", "让步", "分发", "发放", "公布", "发出", "散发", "归还", "吐出", "发明", "编造", "化妆", "弥补", "和解", "辨认",
  "看清", "填写", "理解", "前往", "逃跑", "逃走", "避开", "限制", "禁闭", "排除", "派遣", "派", "打发", "召唤", "雇佣", "释放", "泄露", "拆穿",
  "失望", "泄气", "降下", "允许", "承认", "引入", "容纳", "饶恕", "赦免", "免除", "告别", "送行", "抚养", "养育", "系紧", "需要", "重复"
];

let corrected = 0;
for (const s of step1) {
  let matchedVerb = "";
  for (const v of VERBS) {
    if (s.zh && s.zh.includes(v)) {
      matchedVerb = v;
      break;
    }
  }

  // normalize some verbs to 1-2 chars
  if (matchedVerb === "穿上") matchedVerb = "穿";
  if (matchedVerb === "戴上") matchedVerb = "戴";
  if (matchedVerb === "脱下" || matchedVerb === "脱掉") matchedVerb = "脱";
  if (matchedVerb === "挂起") matchedVerb = "挂";
  if (matchedVerb === "升起") matchedVerb = "升";
  if (matchedVerb === "举起") matchedVerb = "举";
  if (matchedVerb === "放下") matchedVerb = "放";
  if (matchedVerb === "写下" || matchedVerb === "记下" || matchedVerb === "登记") matchedVerb = "写";
  if (matchedVerb === "铺上") matchedVerb = "铺";
  if (matchedVerb === "涂上") matchedVerb = "涂";
  if (matchedVerb === "贴上") matchedVerb = "贴";
  if (matchedVerb === "掏出") matchedVerb = "掏";
  if (matchedVerb === "盖上") matchedVerb = "盖";
  if (matchedVerb === "进入" || matchedVerb === "进去") matchedVerb = "进";
  if (matchedVerb === "出来" || matchedVerb === "出去") matchedVerb = "出";
  if (matchedVerb === "移开" || matchedVerb === "拿开") matchedVerb = "移";

  if (matchedVerb && matchedVerb !== s.replaces) {
    corrected++;
    console.log(`ID ${s.id}: "${s.sentence}" (${s.zh}) -> old: "${s.replaces}", suggested: "${matchedVerb}"`);
  }
}

console.log(`Total suggested corrections: ${corrected}`);
