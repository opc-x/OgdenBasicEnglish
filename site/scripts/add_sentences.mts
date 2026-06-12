import { analyzeSentence } from "../src/practice/be850Lexicon";
import * as fs from "fs";
import * as path from "path";

// Define the sentence structure matching the training data
interface NewSentence {
  step: number;
  type: string;
  sentence: string;
  zh: string;
  operator: string;
  direction?: string;
  noun?: string;
  replaces?: string;
}

// PLACE NEW SENTENCES HERE FOR THE CURRENT BATCH
const batchSentences: NewSentence[] = [
  // sharp (needed 1)
  { step: 2, type: "op_noun", sentence: "The needle has a sharp point.", zh: "针有尖锐的尖端。", operator: "have", noun: "sharp" },
  // smooth (needed 3)
  { step: 2, type: "op_noun", sentence: "The stone is smooth.", zh: "石头是光滑的。", operator: "be", noun: "smooth" },
  { step: 2, type: "op_noun", sentence: "The side of the board is smooth.", zh: "木板的侧面是光滑的。", operator: "be", noun: "smooth" },
  { step: 2, type: "op_noun", sentence: "He has a smooth skin.", zh: "他的皮肤很光滑。", operator: "have", noun: "smooth" },
  // sticky (needed 3)
  { step: 2, type: "op_noun", sentence: "This sweet food is sticky.", zh: "这种甜食很粘。", operator: "be", noun: "sticky" },
  { step: 2, type: "op_noun", sentence: "He put the sticky paste on the paper.", zh: "他把粘乎乎的浆糊抹在纸上。", operator: "put", noun: "sticky" },
  { step: 2, type: "op_noun", sentence: "The floor was sticky from the wine.", zh: "地板上因为洒了酒而粘糊糊的。", operator: "be", noun: "sticky" },
  // stiff (needed 3)
  { step: 2, type: "op_noun", sentence: "This new cloth is stiff.", zh: "这块新布很硬。", operator: "be", noun: "stiff" },
  { step: 2, type: "op_noun", sentence: "The collar of the shirt is stiff.", zh: "衬衫的领子很硬。", operator: "be", noun: "stiff" },
  { step: 2, type: "op_noun", sentence: "The arm of the boy was stiff after the work.", zh: "工作后，男孩的手臂很僵硬。", operator: "be", noun: "stiff" },
  // straight (needed 2)
  { step: 2, type: "op_noun", sentence: "This is a straight line.", zh: "这是一条直线。", operator: "be", noun: "straight" },
  { step: 2, type: "op_noun", sentence: "The road is straight.", zh: "路是直的。", operator: "be", noun: "straight" },
  // sudden (needed 1)
  { step: 2, type: "op_noun", sentence: "The noise was sudden.", zh: "声音很突然。", operator: "be", noun: "sudden" },
  // sweet (needed 1)
  { step: 2, type: "op_noun", sentence: "The fruit has a sweet taste.", zh: "这水果有甜味。", operator: "have", noun: "sweet" },
  // tall (needed 3)
  { step: 2, type: "op_noun", sentence: "The boy is very tall.", zh: "这男孩非常高。", operator: "be", noun: "tall" },
  { step: 2, type: "op_noun", sentence: "He saw a tall tree.", zh: "他看到了一棵高大的树。", operator: "see", noun: "tall" },
  { step: 2, type: "op_noun", sentence: "The structure of the building is tall.", zh: "建筑的结构很高。", operator: "be", noun: "tall" },
  // tight (needed 3)
  { step: 2, type: "op_noun", sentence: "The shoe is tight.", zh: "鞋很紧。", operator: "be", noun: "tight" },
  { step: 2, type: "op_noun", sentence: "He made a tight knot.", zh: "他打了一个紧紧的结。", operator: "make", noun: "tight" },
  { step: 2, type: "op_noun", sentence: "The band of the dress was tight.", zh: "连衣裙的带子很紧。", operator: "be", noun: "tight" },
  // tired (needed 2)
  { step: 2, type: "op_noun", sentence: "He was tired after the run.", zh: "跑步后他累了。", operator: "be", noun: "tired" },
  { step: 2, type: "op_noun", sentence: "The horse was tired from the journey.", zh: "马因为旅途而劳累。", operator: "be", noun: "tired" },
  // true (needed 3)
  { step: 2, type: "op_noun", sentence: "This is a true story.", zh: "这是一个真实的故事。", operator: "be", noun: "true" },
  { step: 2, type: "op_noun", sentence: "The statement of the boy was true.", zh: "男孩的陈述是真实的。", operator: "be", noun: "true" },
  { step: 2, type: "op_noun", sentence: "He is a true friend.", zh: "他是位真正的朋友。", operator: "be", noun: "true" },
  // violent (needed 3)
  { step: 2, type: "op_noun", sentence: "The wind was violent yesterday.", zh: "昨天风刮得很猛烈。", operator: "be", noun: "violent" },
  { step: 2, type: "op_noun", sentence: "He made a violent protest.", zh: "他提出了猛烈的抗议。", operator: "make", noun: "violent" },
  { step: 2, type: "op_noun", sentence: "This was a violent blow.", zh: "这是一次猛烈的打击。", operator: "be", noun: "violent" },
  // waiting (needed 1)
  { step: 2, type: "op_noun", sentence: "The carriage is waiting at the door.", zh: "马车在门口等待。", operator: "be", noun: "waiting" },
  // wide (needed 2)
  { step: 2, type: "op_noun", sentence: "The road is very wide.", zh: "路非常宽。", operator: "be", noun: "wide" },
  { step: 2, type: "op_noun", sentence: "He has a wide bed.", zh: "他有一张宽床。", operator: "have", noun: "wide" },
  // wise (needed 3)
  { step: 2, type: "op_noun", sentence: "The chief is a wise man.", zh: "首领是一个聪明人。", operator: "be", noun: "wise" },
  { step: 2, type: "op_noun", sentence: "This was a wise decision.", zh: "这是一个明智的决定。", operator: "be", noun: "wise" },
  { step: 2, type: "op_noun", sentence: "He gave a wise answer.", zh: "他给出了一个明智的回答。", operator: "give", noun: "wise" },
  // yellow (needed 3)
  { step: 2, type: "op_noun", sentence: "The flower is yellow.", zh: "花是黄色的。", operator: "be", noun: "yellow" },
  { step: 2, type: "op_noun", sentence: "He saw a yellow bird.", zh: "他看到了一张黄鸟。", operator: "see", noun: "yellow" },
  { step: 2, type: "op_noun", sentence: "The cover of the book is yellow.", zh: "书的封面是黄色的。", operator: "be", noun: "yellow" },
  // young (needed 1)
  { step: 2, type: "op_noun", sentence: "He is a young person.", zh: "他是个年轻人。", operator: "be", noun: "young" },
  // awake (needed 3)
  { step: 2, type: "op_noun", sentence: "The baby is awake now.", zh: "宝宝现在醒了。", operator: "be", noun: "awake" },
  { step: 2, type: "op_noun", sentence: "He was awake all night.", zh: "他通宵未眠。", operator: "be", noun: "awake" },
  { step: 2, type: "op_noun", sentence: "The boy was awake before the sun.", zh: "这男孩在日出前就醒了。", operator: "be", noun: "awake" },
  // bent (needed 2)
  { step: 2, type: "op_noun", sentence: "The wire is bent.", zh: "金属线弯曲了。", operator: "be", noun: "bent" },
  { step: 2, type: "op_noun", sentence: "He saw a bent stick on the earth.", zh: "他看见地上有一根弯曲的木棍。", operator: "see", noun: "bent" },
  // bitter (needed 3)
  { step: 2, type: "op_noun", sentence: "This drink has a bitter taste.", zh: "这种饮料味道苦涩。", operator: "have", noun: "bitter" },
  { step: 2, type: "op_noun", sentence: "The weather was bitter cold.", zh: "天气严寒。", operator: "be", noun: "bitter" },
  { step: 2, type: "op_noun", sentence: "He has a bitter feeling about the loss.", zh: "他对这次损失感到痛苦。", operator: "have", noun: "bitter" },
  // blue (needed 2)
  { step: 2, type: "op_noun", sentence: "The sky is blue.", zh: "天空是蓝色的。", operator: "be", noun: "blue" },
  { step: 2, type: "op_noun", sentence: "He has a blue shirt.", zh: "他有一件蓝色衬衫。", operator: "have", noun: "blue" },
  // certain (needed 3)
  { step: 2, type: "op_noun", sentence: "He is certain of the fact.", zh: "他确信这个事实。", operator: "be", noun: "certain" },
  { step: 2, type: "op_noun", sentence: "This is a certain way to the town.", zh: "这是去镇上的一条确定路线。", operator: "be", noun: "certain" },
  { step: 2, type: "op_noun", sentence: "The end of the story is certain.", zh: "故事的结局是确定的。", operator: "be", noun: "certain" },
  // complete (needed 2)
  { step: 2, type: "op_noun", sentence: "The work is complete now.", zh: "工作现在完成了。", operator: "be", noun: "complete" },
  { step: 2, type: "op_noun", sentence: "He made a complete list of the books.", zh: "他列出了一份完整的书单。", operator: "make", noun: "complete" },
  // cruel (needed 3)
  { step: 2, type: "op_noun", sentence: "The act was very cruel.", zh: "这一行为非常残忍。", operator: "be", noun: "cruel" },
  { step: 2, type: "op_noun", sentence: "He saw a cruel man.", zh: "他看到了一个残忍的男人。", operator: "see", noun: "cruel" },
  { step: 2, type: "op_noun", sentence: "This was a cruel punishment.", zh: "这是一种残忍的惩罚。", operator: "be", noun: "cruel" },
  // dead (needed 3)
  { step: 2, type: "op_noun", sentence: "The dog is dead.", zh: "狗死了。", operator: "be", noun: "dead" },
  { step: 2, type: "op_noun", sentence: "He saw a dead bird.", zh: "他看见一只死鸟。", operator: "see", noun: "dead" },
  { step: 2, type: "op_noun", sentence: "The grass in the field is dead.", zh: "田里的草枯死了。", operator: "be", noun: "dead" },
  // dear (needed 3)
  { step: 2, type: "op_noun", sentence: "This book is dear to the boy.", zh: "这本书对这男孩很珍贵。", operator: "be", noun: "dear" },
  { step: 2, type: "op_noun", sentence: "The price of the food is dear.", zh: "食物的价格很贵。", operator: "be", noun: "dear" },
  { step: 2, type: "op_noun", sentence: "He is a dear friend.", zh: "他是位亲密的朋友。", operator: "be", noun: "dear" },
  // delicate (needed 3)
  { step: 2, type: "op_noun", sentence: "The flower has a delicate structure.", zh: "这朵花有着精致的结构。", operator: "have", noun: "delicate" },
  { step: 2, type: "op_noun", sentence: "This glass is very delicate.", zh: "这个玻璃杯非常精致易碎。", operator: "be", noun: "delicate" },
  { step: 2, type: "op_noun", sentence: "He has a delicate skin.", zh: "他的皮肤很娇嫩。", operator: "have", noun: "delicate" },
  // different (needed 2)
  { step: 2, type: "op_noun", sentence: "The books are different.", zh: "这些书是不同的。", operator: "be", noun: "different" },
  { step: 2, type: "op_noun", sentence: "He went to a different town.", zh: "他去了一个不同的城镇。", operator: "go", noun: "different" },
  // dirty (needed 3)
  { step: 2, type: "op_noun", sentence: "The floor of the room is dirty.", zh: "房间的地板很脏。", operator: "be", noun: "dirty" },
  { step: 2, type: "op_noun", sentence: "He has a dirty shirt.", zh: "他有一件脏衬衫。", operator: "have", noun: "dirty" },
  { step: 2, type: "op_noun", sentence: "The water in the pot was dirty.", zh: "罐子里的水很脏。", operator: "be", noun: "dirty" },
  // dry (needed 1)
  { step: 2, type: "op_noun", sentence: "The sand of the land was dry.", zh: "土地的沙子很干。", operator: "be", noun: "dry" },
  // false (needed 3)
  { step: 2, type: "op_noun", sentence: "This statement is false.", zh: "这个陈述是虚假的。", operator: "be", noun: "false" },
  { step: 2, type: "op_noun", sentence: "He gave a false name.", zh: "他给了一个假名字。", operator: "give", noun: "false" },
  { step: 2, type: "op_noun", sentence: "The story was false.", zh: "故事是假的。", operator: "be", noun: "false" },
  // feeble (needed 3)
  { step: 2, type: "op_noun", sentence: "The old man is feeble.", zh: "老人很虚弱。", operator: "be", noun: "feeble" },
  { step: 2, type: "op_noun", sentence: "He gave a feeble cry.", zh: "他发出一声微弱的哭声。", operator: "give", noun: "feeble" },
  { step: 2, type: "op_noun", sentence: "The light from the window was feeble.", zh: "窗户射进来的光线很微弱。", operator: "be", noun: "feeble" },
  // female (needed 3)
  { step: 2, type: "op_noun", sentence: "This is a female bird.", zh: "这是一只雌鸟。", operator: "be", noun: "female" },
  { step: 2, type: "op_noun", sentence: "He has a female baby.", zh: "他有一个女婴。", operator: "have", noun: "female" },
  { step: 2, type: "op_noun", sentence: "The chief has a female servant.", zh: "首领有一个女仆。", operator: "have", noun: "female" },
  // foolish (needed 3)
  { step: 2, type: "op_noun", sentence: "This was a foolish act.", zh: "这是一个愚蠢的行为。", operator: "be", noun: "foolish" },
  { step: 2, type: "op_noun", sentence: "The boy gave a foolish answer.", zh: "男孩给出了一个愚蠢的回答。", operator: "give", noun: "foolish" },
  { step: 2, type: "op_noun", sentence: "He did make a foolish statement.", zh: "他做了一个愚蠢的陈述。", operator: "make", noun: "foolish" },
  // ill (needed 1)
  { step: 2, type: "op_noun", sentence: "The boy was ill yesterday.", zh: "男孩昨天病了。", operator: "be", noun: "ill" },
  // left (needed 2)
  { step: 2, type: "op_noun", sentence: "He was on the left side of the road.", zh: "他在路的左边。", operator: "be", noun: "left" },
  { step: 2, type: "op_noun", sentence: "He put the book in the left drawer.", zh: "他把书放进左边的抽屉里。", operator: "put", noun: "left" },
  // loose (needed 3)
  { step: 2, type: "op_noun", sentence: "The tooth is loose.", zh: "牙齿松了。", operator: "be", noun: "loose" },
  { step: 2, type: "op_noun", sentence: "He has a loose collar.", zh: "他的衣领很松。", operator: "have", noun: "loose" },
  { step: 2, type: "op_noun", sentence: "The box has a loose cover.", zh: "盒子有一个松动的盖子。", operator: "have", noun: "loose" },
  // loud (needed 1)
  { step: 2, type: "op_noun", sentence: "He gave a loud cry.", zh: "他大喊了一声。", operator: "give", noun: "loud" },
  // low (needed 2)
  { step: 2, type: "op_noun", sentence: "The wall of the house is low.", zh: "房子的墙很矮。", operator: "be", noun: "low" },
  { step: 2, type: "op_noun", sentence: "He went down to the low land.", zh: "他下到了低矮的土地上。", operator: "go", noun: "low" },
  // narrow (needed 3)
  { step: 2, type: "op_noun", sentence: "The street is very narrow.", zh: "街道非常窄。", operator: "be", noun: "narrow" },
  { step: 2, type: "op_noun", sentence: "He went through a narrow opening.", zh: "他穿过了一个狭窄的通道。", operator: "go", noun: "narrow" },
  { step: 2, type: "op_noun", sentence: "The bed of the room was narrow.", zh: "房间的床很窄。", operator: "be", noun: "narrow" },
  // opposite (needed 3)
  { step: 2, type: "op_noun", sentence: "The house is on the opposite side of the street.", zh: "房子在街道的对面。", operator: "be", noun: "opposite" },
  { step: 2, type: "op_noun", sentence: "He went in the opposite direction.", zh: "他朝相反的方向走去。", operator: "go", noun: "opposite" },
  { step: 2, type: "op_noun", sentence: "The words have opposite senses.", zh: "这些词有相反的意思。", operator: "have", noun: "opposite" },
  // public (needed 3)
  { step: 2, type: "op_noun", sentence: "This is a public garden.", zh: "这是一个公园。", operator: "be", noun: "public" },
  { step: 2, type: "op_noun", sentence: "He went to a public place.", zh: "他去了一个公共场所。", operator: "go", noun: "public" },
  { step: 2, type: "op_noun", sentence: "This road is for public use.", zh: "这条路是供公众使用的。", operator: "be", noun: "public" },
  // rough (needed 3)
  { step: 2, type: "op_noun", sentence: "The side of the stone is rough.", zh: "石头的表面很粗糙。", operator: "be", noun: "rough" },
  { step: 2, type: "op_noun", sentence: "The water in the sea was rough.", zh: "海里的水很汹涌。", operator: "be", noun: "rough" },
  { step: 2, type: "op_noun", sentence: "He has a rough skin.", zh: "他的皮肤很粗糙。", operator: "have", noun: "rough" },
  // short (needed 2)
  { step: 2, type: "op_noun", sentence: "This is a short story.", zh: "这是一个短篇故事。", operator: "be", noun: "short" },
  { step: 2, type: "op_noun", sentence: "He did make a short journey.", zh: "他作了一次短途旅行。", operator: "make", noun: "short" },
  // shut (needed 3)
  { step: 2, type: "op_noun", sentence: "The door is shut.", zh: "门关着。", operator: "be", noun: "shut" },
  { step: 2, type: "op_noun", sentence: "He put the books in the shut drawer.", zh: "他把书放进关着的抽屉里。", operator: "put", noun: "shut" },
  { step: 2, type: "op_noun", sentence: "The window is shut now.", zh: "窗户现在关上了。", operator: "be", noun: "shut" },
  // simple (needed 3)
  { step: 2, type: "op_noun", sentence: "This is a simple question.", zh: "这是一个简单的问题。", operator: "be", noun: "simple" },
  { step: 2, type: "op_noun", sentence: "He gave a simple answer.", zh: "他给出了一个简单的回答。", operator: "give", noun: "simple" },
  { step: 2, type: "op_noun", sentence: "He made a simple design for the house.", zh: "他为房子做了一个简单的设计。", operator: "make", noun: "simple" },
  // slow (needed 3)
  { step: 2, type: "op_noun", sentence: "The train is very slow.", zh: "火车非常慢。", operator: "be", noun: "slow" },
  { step: 2, type: "op_noun", sentence: "He did a slow walk.", zh: "他慢吞吞地走着。", operator: "do", noun: "slow" },
  { step: 2, type: "op_noun", sentence: "The growth of the plant was slow.", zh: "植物生长缓慢。", operator: "be", noun: "slow" },
  // small (needed 1)
  { step: 2, type: "op_noun", sentence: "He has a small box.", zh: "他有一个小盒子。", operator: "have", noun: "small" },
  // soft (needed 3)
  { step: 2, type: "op_noun", sentence: "The bed is very soft.", zh: "床非常软。", operator: "be", noun: "soft" },
  { step: 2, type: "op_noun", sentence: "He has a soft voice.", zh: "他的声音很温柔。", operator: "have", noun: "soft" },
  { step: 2, type: "op_noun", sentence: "The touch of the wool was soft.", zh: "羊毛的触感很柔软。", operator: "be", noun: "soft" },
  // solid (needed 3)
  { step: 2, type: "op_noun", sentence: "This table is made of solid wood.", zh: "这张桌子是实木做的。", operator: "be", noun: "solid" },
  { step: 2, type: "op_noun", sentence: "The ice was very solid.", zh: "冰非常坚实。", operator: "be", noun: "solid" },
  { step: 2, type: "op_noun", sentence: "This structure has a solid base.", zh: "这个结构有一个坚实的基础。", operator: "have", noun: "solid" },
  // thin (needed 3)
  { step: 2, type: "op_noun", sentence: "The paper is very thin.", zh: "纸非常薄。", operator: "be", noun: "thin" },
  { step: 2, type: "op_noun", sentence: "He has a thin coat.", zh: "他有一件薄外套。", operator: "have", noun: "thin" },
  { step: 2, type: "op_noun", sentence: "The line on the board was thin.", zh: "板上的线条很细。", operator: "be", noun: "thin" }
];

function main() {
  if (batchSentences.length === 0) {
    console.log("No sentences in the current batch. Please add some to batchSentences.");
    process.exit(0);
  }

  console.log(`Validating batch of ${batchSentences.length} sentences...`);
  let failures = 0;

  for (let i = 0; i < batchSentences.length; i++) {
    const s = batchSentences[i];
    
    // Check length (4 to 10 words)
    const wordCount = s.sentence.split(/\s+/).filter(Boolean).length;
    if (wordCount < 4 || wordCount > 10) {
      console.error(`Length violation at index ${i}: "${s.sentence}" has ${wordCount} words (must be 4-10).`);
      failures++;
    }

    // Validate using analyzeSentence
    const analysis = analyzeSentence(s.sentence);
    if (analysis.score !== 100) {
      failures++;
      console.error(`Validation Failure at index ${i}:`);
      console.error(`  Sentence: "${s.sentence}"`);
      console.error(`  Score: ${analysis.score}`);
      console.error(`  Violations:`, analysis.tokens.filter(t => t.status === "violation"));
    }
  }

  if (failures > 0) {
    console.error(`Found ${failures} validation errors. Batch NOT saved.`);
    process.exit(1);
  }

  console.log("All sentences in batch validated successfully! Appending to new_sentences_data.json...");

  const dataPath = path.resolve("scripts/new_sentences_data.json");
  let existingSentences: NewSentence[] = [];

  if (fs.existsSync(dataPath)) {
    existingSentences = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  }

  // Check for duplicates in existing
  const existingTexts = new Set(existingSentences.map(s => s.sentence.toLowerCase().trim()));
  let added = 0;
  for (const s of batchSentences) {
    const norm = s.sentence.toLowerCase().trim();
    if (existingTexts.has(norm)) {
      console.warn(`Duplicate sentence skipped: "${s.sentence}"`);
    } else {
      existingSentences.push(s);
      added++;
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(existingSentences, null, 2), "utf8");
  console.log(`Successfully added ${added} sentences. Total sentences now: ${existingSentences.length}/1440.`);

  // Calculate coverage
  const missingWords = JSON.parse(fs.readFileSync(path.resolve("scripts/missing_words.json"), "utf8"));
  const coverageMap = new Map<string, number>();
  for (const s of existingSentences) {
    const word = s.noun || s.direction;
    if (word) {
      coverageMap.set(word, (coverageMap.get(word) || 0) + 1);
    }
  }

  let wordsCovered = 0;
  let totalMissingWords = missingWords.length;
  for (const mw of missingWords) {
    const count = coverageMap.get(mw.word) || 0;
    if (count >= mw.needed) {
      wordsCovered++;
    }
  }

  console.log(`Word coverage progress: ${wordsCovered}/${totalMissingWords} missing words fully covered.`);
}

main();
