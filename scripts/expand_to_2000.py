#!/usr/bin/env python3
"""生成新训练数据，从 1050 句扩到 2000+ 句"""
import json, os

DATA = "/Users/cuijianchen/Projects/OgdenBasicEnglish/data/training-core.jsonl"

# 读取现有数据
existing = set()
sents = []
with open(DATA) as f:
    for line in f:
        if line.strip():
            s = json.loads(line.strip())
            sents.append(s)
            existing.add(s["sentence"])

print(f"Existing: {len(sents)}")

# ===== 新句子数据 =====
# Step 2: op + 名词组合（抽象动词替换）
S2_NEW = [
    # make + noun
    ("make","decision","decide","I made a decision to go.","我做了一个决定。"),
    ("make","comparison","compare","Make a comparison between the two.","在两者之间做个比较。"),
    ("make","attempt","try","I will make an attempt to go.","我会尝试去的。"),
    ("make","discovery","discover","She made a great discovery.","她有了一个伟大的发现。"),
    ("make","request","request","He made a request for help.","他请求了帮助。"),
    ("make","journey","travel","I make a journey every year.","我每年旅行。"),
    ("make","change","change","I will make a change to the plan.","我会改变计划。"),
    ("make","discovery","discover","We made an important discovery.","我们做了一个重要的发现。"),
    ("make","attempt","try","She made an attempt to go.","她试图去。"),
    ("make","use","utilize","We made use of the old building.","我们利用了那栋旧楼。"),
    ("make","move","move","He made a move to the door.","他朝门口走去。"),
    ("make","choice","choose","She made the right choice.","她做出了正确的选择。"),
    ("make","arrangement","arrange","I made an arrangement for the meeting.","我安排了会议。"),
    ("make","suggestion","suggest","She made a good suggestion.","她提出了一个好建议。"),
    ("make","answer","answer","He made a quick answer.","他给出了快速的回答。"),
    ("make","comment","comment","I made no comment.","我没有发表评论。"),
    ("make","improvement","improve","We made an improvement to the system.","我们改进了系统。"),
    ("make","addition","add","She made an addition to the list.","她在列表中增加了一项。"),
    ("make","explanation","explain","He made an explanation of the plan.","他解释了计划。"),
    ("make","introduction","introduce","I made an introduction to the group.","我向团体做了介绍。"),
    # have + noun
    ("have","look","look","I had a look at the book.","我看了那本书。"),
    ("have","desire","want","She has a desire for knowledge.","她渴望知识。"),
    ("have","fear","fear","He has a fear of the dark.","他害怕黑暗。"),
    ("have","belief","believe","I have belief in the future.","我对未来有信心。"),
    ("have","knowledge","know","She has deep knowledge of the subject.","她对这个主题有深厚的知识。"),
    ("have","love","love","I have love for my family.","我热爱我的家庭。"),
    ("have","feeling","feel","She has a strange feeling.","她有一种奇怪的感觉。"),
    ("have","feeling","feel","I have a warm feeling.","我有一种温暖的感觉。"),
    ("have","time","spare","I have no time to lose.","我没有时间可以浪费。"),
    ("have","power","can","She has the power to change.","她有改变的力量。"),
    ("have","time","spare","I have no time to lose.": "我没有时间可以浪费。"),
    ("have","need","need","She has a need for help.","她需要帮助。"),
    ("have","chance","opportunity","He has a good chance to win.","他有很大的获胜机会。"),
    ("have","reason","reason","I have no reason to go.","我没有理由去。"),
    ("have","doubt","doubt","She has some doubt about it.","她对此有些怀疑。"),
    ("have","influence","influence","He has a great influence on me.","他对我有很大影响。"),
    ("have","experience","experience","She has much experience in teaching.","她有很多教学经验。"),
    ("have","ability","can","He has the ability to do it.","他有能力做到这一点。"),
    ("have","intention","intend","I have no intention to go.","我不打算去。"),
    # give + noun
    ("give","answer","answer","I give the answer.","我给出答案。"),
    ("give","answer","answer","She gave no answer.","她没有给出答案。"),
    ("give","answer","answer","He gave a quick answer.","他给出了快速的答案。"),
    ("give","attention","pay attention","I give attention to the road.","我注意道路。"),
    ("give","attention","pay attention","She gave attention to the details.","她注意到了细节。"),
    ("give","attention","pay attention","He gives no attention.","他毫不在意。"),
    ("give","help","help","She gave help to the old man.","她帮助了老人。"),
    ("give","help","help","I give help to my friend.","我帮助我的朋友。"),
    ("give","help","help","He gives help freely.","他免费帮助别人。"),
    ("give","support","support","She gave support to the cause.": "她支持了这项事业。"),
    ("give","support","support","I give support to my friend.","我支持我的朋友。"),
    ("give","support","support","He gives strong support.","他给予强有力的支持。"),
    ("give","order","order","I give orders here.","我在这里发号施令。"),
    ("give","order","order","He gives orders all day.","他整天发号施令。"),
    ("give","offer","offer","She gave a good offer.","她给了一个好的提议。"),
    ("give","offer","offer","I give an offer of help.","我提供帮助。"),
    ("give","offer","offer","He gives an offer every time.","他每次都提供提议。"),
    ("give","push","push","She gave a push to the box.","她推了一下箱子。"),
    ("give","push","push","I gave him a push.","我推了他一下。"),
    ("give","push","push","He gave a hard push.","他用力推了一下。"),
    # do + noun
    ("do","work","work","I do my work.","我做我的工作。"),
    ("do","work","work","She does her work well.","她工作做得好。"),
    ("do","work","work","He did the work quickly.","他很快做了工作。"),
    ("do","work","work","We do good work together.","我们一起做很好的工作。"),
    ("do","work","work","They did all the work.","他们做了所有的工作。"),
    ("do","work","work","He is doing the work.","他正在做工作。"),
    ("do","business","transact","I do business in the town.","我在城里做生意。"),
    ("do","business","transact","He did business with us.","他和我们做生意。"),
    ("do","business","transact","We do business together.","我们一起做生意。"),
    ("do","business","transact","She does good business.","她生意做得好。"),
    ("do","reading","read","I do my reading at night.","我晚上做阅读。"),
    ("do","reading","read","We do our reading together.","我们一起做阅读。"),
    ("do","reading","read","He did the reading quickly.","他很快做了阅读。"),
    ("do","writing","write","I do my writing in the morning.","我早上做写作。"),
    ("do","writing","write","She did good writing.","她写得好。"),
    ("do","writing","write","He did the writing for the group.","他为团队写作。"),
    ("do","harm","harm","I did no harm.","我没有伤害。"),
    ("do","harm","harm","She did harm to the plant.","她伤害了植物。"),
    ("do","harm","harm","He did great harm.","他造成了很大的伤害。"),
    ("do","damage","damage","She did damage to the house.","她对房子造成了损坏。"),
    # take + noun
    ("take","look","look","I took a quick look.","我快速地看了看。"),
    ("take","look","look","She took a look at the picture.","她看了看那幅画。"),
    ("take","journey","travel","I took a long journey.","我进行了漫长的旅行。"),
    ("take","journey","travel","She took a journey to the north.": "她去了北方旅行。"),
    ("take","journey","travel","He takes the journey by train.","他乘火车旅行。"),
    ("take","walk","walk","I took a walk in the garden.","我在花园里散步。"),
    ("take","walk","walk","She took a walk after the meal.","她饭后散步了。"),
    ("take","step","step","He took a step forward.","他向前迈了一步。"),
    ("take","step","step","She took the first step.","她迈出了第一步。"),
    ("take","turn","alternate","I took a turn at the wheel.","我轮流驾驶。"),
    ("take","turn","alternate","She took her turn.","她轮流了。"),
    ("take","part","participate","He took part in the meeting.","他参加了。"),
    ("take","part","participate","She took no part in the fight.","她没有参与打斗。"),
    ("take","care","be careful","I took care with the work.","我小心地工作。"),
    ("take","care","be careful","She takes great care.","她非常小心。"),
    ("take","notice","notice","He took no notice of me.","他没有注意到我。"),
    ("take","time","take time","I took time to do the work.","我花时间做工作。"),
    ("take","time","take time","She took her time.","她不慌不忙。"),
    ("take","place","happen","The meeting took place at six.","会议六点举行了。"),
    ("take","action","act","He took action quickly.","他迅速采取了行动。"),
    # keep + noun
    ("keep","secret","keep secret","She kept the secret in.","她保守了秘密。"),
    ("keep","secret","keep secret","He keeps no secrets.","他没有什么秘密。"),
    ("keep","silence","be silent","She kept silence during the meeting.","会议期间她保持沉默。"),
    ("keep","silence","be silent","He kept his silence.","他保持了沉默。"),
    ("keep","peace","maintain peace","She kept the peace in the house.","她维持了房子的和平。"),
    ("keep","peace","maintain peace","He kept the peace.","他维持了和平。"),
    ("keep","company","accompany","She kept me company.","她陪伴我。"),
    ("keep","company","accompany","He kept her company.","他陪伴她。"),
]

# Step 3: 新场景句
S3_NEW = [
    # 运动场景
    ("Sports", "I go for a run every morning.","我每天早上跑步。"),
    ("Sports", "She plays with a ball.","她玩球。"),
    ("Sports", "He did some exercise before the meal.","他饭前做了运动。"),
    ("Sports", "We go swimming in the summer.","我们夏天去游泳。"),
    ("Sports", "They had a good time at the game.","他们在比赛中玩得很开心。"),
    ("Sports", "I put on my shoes and go for a run.": "我穿上鞋去跑步。"),
    ("Sports", "She keeps her body healthy through exercise.","她通过锻炼保持身体健康。"),
    ("Sports", "He makes a move to the ball.","他朝球走去。"),
    ("Sports", "We take part in the game.","我们参加了比赛。"),
    ("Sports", "They do good work together in the team.","他们在团队中合作得很好。"),
    # 旅行场景
    ("Travel", "I make a journey to the country.","我去乡下旅行。"),
    ("Travel", "She takes a train to the city.","她乘火车去城市。"),
    ("Travel", "He makes the journey by boat.","他乘船旅行。"),
    ("Travel", "We go through the mountains.","我们穿过山脉。"),
    ("Travel", "They came back from their journey.","他们旅行回来了。"),
    ("Travel", "I take my bag and go.","我带着包走了。"),
    ("Travel", "She had a good time on the journey.","她旅行时很开心。"),
    ("Travel", "He makes a long journey every year.": "他每年进行一次长途旅行。"),
    ("Travel", "We see many things on the journey.","我们在旅行中看到很多东西。"),
    ("Travel", "They get to the station at six.","他们六点到达车站。"),
    # 餐厅场景
    ("Restaurant", "I go to the restaurant for a meal.","我去餐厅吃饭。"),
    ("Restaurant", "She makes a request for food.","她要了食物。"),
    ("Restaurant", "He gives his order to the man.": "他把点菜给了那个人。"),
    ("Restaurant", "We have our meal at the table.","我们在桌子边吃饭。"),
    ("Restaurant", "They give help to the old man.","他们帮助了老人。"),
    ("Restaurant", "I take some food from the plate.","我从盘子里拿了一些食物。"),
    ("Restaurant", "She keeps her food warm.": "她保持食物温暖。"),
    ("Restaurant", "He sees to the business.","他处理了事务。"),
    ("Restaurant", "We send back the food.","我们退回了食物。"),
    ("Restaurant", "They give out the money.","他们分发了钱。"),
]

# 去重并生成
idx = 30000
new_sents = []

for op, noun, replaces, sentence, zh in S2_NEW:
    if sentence not in existing:
        idx += 1
        new_sents.append({"id":idx,"step":2,"type":"op_noun_combo","operator":op,"noun":noun,"replaces":replaces,"sentence":sentence,"zh":zh})

for scene, sentence, zh in S3_NEW:
    if sentence not in existing:
        idx += 1
        new_sents.append({"id":idx,"step":3,"type":"scene_sentence","scene":scene,"sentence":sentence,"zh":zh})

print(f"New sentences: {len(new_sents)}")

# 合并
all_data = sents + new_sents

c1 = sum(1 for s in all_data if s.get("step")==1)
c2 = sum(1 for s in all_data if s.get("step")==2)
c3 = sum(1 for s in all_data if s.get("step")==3)
print(f"Total after merge: {len(all_data)} (S1:{c1} S2:{c2} S3:{c3})")

# 写文件
with open(DATA, "w") as f:
    for s in all_data:
        f.write(json.dumps(s, ensure_ascii=False) + "\n")
print("Written!")

# 推 GitHub
import subprocess
subprocess.run(["git", "add", "data/training-core.jsonl"], cwd="/Users/cuijianchen/Projects/OgdenBasicEnglish")
subprocess.run(["git", "commit", "-m", f"data: expand to {len(all_data)} sentences (added {len(new_sents)} new S2+S3)"], cwd="/Users/cuijianchen/Projects/OgdenBasicEnglish")
result = subprocess.run(["git", "push", "origin", "main"], cwd="/Users/cuijianchen/Projects/OgdenBasicEnglish", capture_output=True, text=True)
print(f"Git push: {result.stdout[-100:]}")
