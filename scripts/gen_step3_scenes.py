#!/usr/bin/env python3
"""
Step 3 场景扩量：从 7 场景扩到 21 场景
每场景 5-10 句，只用 850 词 + operator 组合
"""
import json

# 新增 14 个场景（已有 7 个：My Room, At a Meal, At the Station, Going to the Store, The Body, The Family, The Weather）
# 新增：Shopping, At School, Health, The House, Animals, Nature, Transport, Work, Time, Feelings, Making a Phone Call, At the Bank, At the Post Office, Haircut, Repair, Interview, Emergency

NEW_SCENES = {
    "At the Shop": [
        {"sentence": "I go to the shop.", "note": "去商店"},
        {"sentence": "The shop has food and clothing.", "note": "商店有食物和衣服"},
        {"sentence": "I take a book from the shelf.", "note": "我从书架上拿一本书"},
        {"sentence": "What is the price of this book?", "note": "这本书多少钱？"},
        {"sentence": "The price is three dollars.", "note": "价钱是三美元"},
        {"sentence": "I give the money to the man.", "note": "我把钱给那个人"},
        {"sentence": "I put the book in my bag.", "note": "我把书放进包里"},
        {"sentence": "I go home from the shop.", "note": "我从商店回家"},
        {"sentence": "The shop is open every day.", "note": "商店每天开门"},
    ],
    "At School": [
        {"sentence": "I go to school every day.", "note": "我每天去上学"},
        {"sentence": "The school is a large building.", "note": "学校是一栋大建筑"},
        {"sentence": "My teacher is at school.", "note": "我的老师在学校"},
        {"sentence": "I have a book and a pen.", "note": "我有一本书和一支笔"},
        {"sentence": "The teacher gives us work.", "note": "老师给我们布置作业"},
        {"sentence": "I do my work with my pen.", "note": "我用笔做作业"},
        {"sentence": "I put my book on the table.", "note": "我把书放在桌子上"},
        {"sentence": "The teacher says a new word.", "note": "老师教了一个新词"},
        {"sentence": "I say the word again.", "note": "我把这个词再说一遍"},
        {"sentence": "I keep my book clean.", "note": "我保持书的整洁"},
    ],
    "At the Doctor": [
        {"sentence": "I feel ill today.", "note": "我今天感觉不舒服"},
        {"sentence": "I have a pain in my head.", "note": "我头疼"},
        {"sentence": "My mother takes me to the doctor.", "note": "妈妈带我去看医生"},
        {"sentence": "The doctor says I have a cold.", "note": "医生说我感冒了"},
        {"sentence": "I have a pain in my throat.", "note": "我喉咙痛"},
        {"sentence": "The doctor gives me some medicine.", "note": "医生给了我一些药"},
        {"sentence": "I take the medicine with water.", "note": "我用水服药"},
        {"sentence": "I go to bed and keep warm.", "note": "我去床上躺着，保持温暖"},
        {"sentence": "Tomorrow I will be better.", "note": "明天我会好起来"},
        {"sentence": "I keep my body healthy.", "note": "我保持身体健康"},
    ],
    "The House": [
        {"sentence": "This is my house.", "note": "这是我的房子"},
        {"sentence": "The house has four walls and a roof.", "note": "房子有四面墙和一个屋顶"},
        {"sentence": "The door is in the front wall.", "note": "门在前墙上"},
        {"sentence": "There are two windows in my room.", "note": "我的房间有两个窗户"},
        {"sentence": "I go in through the front door.", "note": "我从前门进去"},
        {"sentence": "The table is in the middle of the room.", "note": "桌子在房间中间"},
        {"sentence": "I put my books on the shelf by the door.", "note": "我把书放在门边的架子上"},
        {"sentence": "There is a garden by the house.", "note": "房子旁边有一个花园"},
        {"sentence": "The house is warm in winter.", "note": "冬天房子很暖和"},
        {"sentence": "I keep my house clean.", "note": "我保持房子干净"},
    ],
    "Animals": [
        {"sentence": "I have a dog.", "note": "我有一只狗"},
        {"sentence": "The dog has four legs and a tail.", "note": "狗有四条腿和一条尾巴"},
        {"sentence": "I give food to the dog every day.", "note": "我每天给狗食物"},
        {"sentence": "The dog goes about the garden.", "note": "狗在花园里走来走去"},
        {"sentence": "I see a bird in the tree.", "note": "我看见树上有一只鸟"},
        {"sentence": "The bird has two wings.", "note": "鸟有两只翅膀"},
        {"sentence": "A cat is on the wall.", "note": "猫在墙上"},
        {"sentence": "The cat sees the bird.", "note": "猫看见了鸟"},
        {"sentence": "I put some water out for the birds.", "note": "我放了一些水给鸟儿喝"},
        {"sentence": "Animals are our friends.", "note": "动物是我们的朋友"},
    ],
    "Nature": [
        {"sentence": "The sun is up.", "note": "太阳升起来了"},
        {"sentence": "The sky is blue and clear.", "note": "天空是蓝色的，很晴朗"},
        {"sentence": "I see the sun through the window.", "note": "我透过窗户看见太阳"},
        {"sentence": "The rain comes down from the clouds.", "note": "雨从云上落下来"},
        {"sentence": "After the rain the air is clean.", "note": "雨后空气很清新"},
        {"sentence": "The wind goes through the trees.", "note": "风吹过树林"},
        {"sentence": "I put on my coat when it is cold.", "note": "天冷的时候我穿上外套"},
        {"sentence": "The snow is white.", "note": "雪是白色的"},
        {"sentence": "In the spring the flowers come out.", "note": "春天花开"},
        {"sentence": "The earth goes round the sun.", "note": "地球绕着太阳转"},
    ],
    "Transport": [
        {"sentence": "I go to the station.", "note": "我去车站"},
        {"sentence": "The train is at the station.", "note": "火车在车站"},
        {"sentence": "I get on the train.", "note": "我上火车"},
        {"sentence": "I give my ticket to the man.", "note": "我把票给那个人"},
        {"sentence": "The train goes through the country.", "note": "火车穿过乡间"},
        {"sentence": "I see the towns through the window.", "note": "我透过窗户看见城镇"},
        {"sentence": "The train goes quickly.", "note": "火车走得很快"},
        {"sentence": "I get off the train at the station.", "note": "我在车站下火车"},
        {"sentence": "I take my bag from the train.", "note": "我从火车上拿我的包"},
        {"sentence": "I go home from the station.", "note": "我从车站回家"},
    ],
    "Work": [
        {"sentence": "I go to work every morning.", "note": "我每天早上上班"},
        {"sentence": "My work is in an office.", "note": "我的工作在一个办公室"},
        {"sentence": "I do my work with my hands.", "note": "我用双手工作"},
        {"sentence": "I put my paper on the table.", "note": "我把文件放在桌子上"},
        {"sentence": "My friend works with me.", "note": "我的朋友和我一起工作"},
        {"sentence": "We do the work together.", "note": "我们一起做工作"},
        {"sentence": "The work is good.", "note": "工作很好"},
        {"sentence": "I keep on with my work.", "note": "我继续我的工作"},
        {"sentence": "I go home from work in the evening.", "note": "我晚上下班回家"},
        {"sentence": "Tomorrow I will do more work.", "note": "明天我会做更多工作"},
    ],
    "Time": [
        {"sentence": "Today is Monday.", "note": "今天是星期一"},
        {"sentence": "The sun comes up in the morning.", "note": "太阳在早上升起"},
        {"sentence": "I go to work in the morning.", "note": "我早上去上班"},
        {"sentence": "I have my meal at midday.", "note": "我中午吃饭"},
        {"sentence": "The sun goes down in the evening.", "note": "太阳在傍晚落下"},
        {"sentence": "At night I go to bed.", "note": "晚上我去睡觉"},
        {"sentence": "Tomorrow is Tuesday.", "note": "明天是星期二"},
        {"sentence": "Yesterday was Sunday.", "note": "昨天是星期天"},
        {"sentence": "The year has four seasons.", "note": "一年有四个季节"},
        {"sentence": "Today is a good day.", "note": "今天是个好日子"},
    ],
    "Feelings": [
        {"sentence": "I feel happy today.", "note": "我今天感到开心"},
        {"sentence": "I have a happy feeling.", "note": "我有开心的感觉"},
        {"sentence": "She seems sad.", "note": "她看起来伤心"},
        {"sentence": "The news made me feel angry.", "note": "这消息让我生气"},
        {"sentence": "I keep my feelings to myself.", "note": "我把感受放在心里"},
        {"sentence": "He seems tired after work.", "note": "他下班后看起来很累"},
        {"sentence": "I give a smile to my friend.", "note": "我对朋友微笑"},
        {"sentence": "She is a kind person.", "note": "她是一个善良的人"},
        {"sentence": "I feel the heat of the fire.", "note": "我感觉到火的热度"},
        {"sentence": "Love is a beautiful feeling.", "note": "爱是一种美妙的感觉"},
    ],
    "Making a Phone Call": [
        {"sentence": "I make a phone call to my friend.", "note": "我给我的朋友打电话"},
        {"sentence": "I get the number from the book.", "note": "我从本子上找到号码"},
        {"sentence": "I put in the number and wait.", "note": "我拨出号码，等着"},
        {"sentence": "My friend says hello.", "note": "我的朋友说你好"},
        {"sentence": "I give my name to my friend.", "note": "我告诉朋友我的名字"},
        {"sentence": "We talk about the weather.", "note": "我们谈论天气"},
        {"sentence": "My friend says she is well.", "note": "我的朋友说她很好"},
        {"sentence": "I put down the phone after the talk.", "note": "谈完话我放下电话"},
        {"sentence": "It was a good talk.", "note": "这是一次愉快的谈话"},
        {"sentence": "I will make another call tomorrow.", "note": "我明天再打一次电话"},
    ],
    "At the Bank": [
        {"sentence": "I go to the bank.", "note": "我去银行"},
        {"sentence": "I have some money in the bank.", "note": "我在银行里有一些钱"},
        {"sentence": "I take my money from the bank.", "note": "我从银行取钱"},
        {"sentence": "The man at the bank gives me my money.", "note": "银行的人把钱给我"},
        {"sentence": "I put the money in my pocket.", "note": "我把钱放进口袋"},
        {"sentence": "I give money to the bank every month.", "note": "我每个月往银行存钱"},
        {"sentence": "The bank keeps my money safe.", "note": "银行安全地保管我的钱"},
        {"sentence": "I go to the bank on Friday.", "note": "我星期五去银行"},
        {"sentence": "The bank is in the center of the town.", "note": "银行在城的中心"},
        {"sentence": "I put my name on the paper at the bank.", "note": "我在银行的纸上写上我的名字"},
    ],
    "At the Post Office": [
        {"sentence": "I go to the post office.", "note": "我去邮局"},
        {"sentence": "I have a letter to send.", "note": "我有一封信要寄"},
        {"sentence": "I put a stamp on the letter.", "note": "我在信上贴一张邮票"},
        {"sentence": "I give the letter to the man.", "note": "我把信给那个人"},
        {"sentence": "I give him money for the stamp.", "note": "我付钱买邮票"},
        {"sentence": "The letter will go to my friend.", "note": "信会寄到我的朋友那里"},
        {"sentence": "My friend is in another town.", "note": "我的朋友在另一个城镇"},
        {"sentence": "The post office is near the station.", "note": "邮局在车站附近"},
        {"sentence": "I get a letter from my friend.", "note": "我收到朋友的来信"},
        {"sentence": "I put the letter in my bag.", "note": "我把信放进包里"},
    ],
    "Haircut": [
        {"sentence": "I go for a haircut.", "note": "我去理发"},
        {"sentence": "The man cuts my hair with scissors.", "note": "那人用剪刀剪我的头发"},
        {"sentence": "I put my head down.", "note": "我低下头"},
        {"sentence": "The hair goes on the floor.", "note": "头发落到地上"},
        {"sentence": "I see my face in the glass.", "note": "我在玻璃里看见我的脸"},
        {"sentence": "The man puts a cloth over me.", "note": "那人把一块布盖在我身上"},
        {"sentence": "My hair is short now.", "note": "我的头发现在很短"},
        {"sentence": "I look different.", "note": "我看起来不一样了"},
        {"sentence": "I give money to the man.", "note": "我付钱给那个人"},
        {"sentence": "I go home with a new look.", "note": "我带着新形象回家"},
    ],
    "Asking Directions": [
        {"sentence": "I go to the man on the street.", "note": "我走向街上的那个人"},
        {"sentence": "I say the name of the place.", "note": "我说那个地方的名字"},
        {"sentence": "I ask the way to the station.", "note": "我去问去车站的路"},
        {"sentence": "The man says go down this road.", "note": "那人说沿着这条路走"},
        {"sentence": "He says go across the bridge.", "note": "他说过桥"},
        {"sentence": "I give the man my thanks.", "note": "我感谢那个人"},
        {"sentence": "I go down the road.", "note": "我沿着路走"},
        {"sentence": "I see the station after the bridge.", "note": "过了桥我看见车站"},
        {"sentence": "I go in through the front door.", "note": "我从前门进去"},
        {"sentence": "The man was very kind.", "note": "那人很善良"},
    ],
    "Emergency": [
        {"sentence": "There is a fire.", "note": "着火了"},
        {"sentence": "I see the fire in the house.", "note": "我看见房子里的火"},
        {"sentence": "I put out the fire with water.", "note": "我用水灭火"},
        {"sentence": "The fire is very hot.", "note": "火很热"},
        {"sentence": "Go out of the house quickly.", "note": "快点从房子里出去"},
        {"sentence": "I go out through the door.", "note": "我从门出去"},
        {"sentence": "The fire goes up to the roof.", "note": "火烧到了屋顶"},
        {"sentence": "I send for help.", "note": "我请求帮助"},
        {"sentence": "The fire is put out.", "note": "火被扑灭了"},
        {"sentence": "No one has a pain.", "note": "没有人受伤"},
    ],
}

# 验证所有句子只用850词
BE850 = set("""come get give go keep let make put seem take be do have say see send may will
about across after against among at before between by down from in off on over through to under up with
of for as till than a the an
I he you who it she we they me him her us them my your his its our their this that these those
all any every little much no other some such what which
and because but or if though while how when where why
again ever far forward here near now out still then there together well
almost enough even not only quite so very tomorrow yesterday north south east west please yes no
able acid angry automatic beautiful black boiling bright broken brown cheap chemical chief clean clear common complex conscious cut deep dependent early elastic electric equal fat fertile first fixed flat free frequent full general good great grey hanging happy hard healthy high hollow important kind like living long male married material medical military natural necessary new normal open parallel past physical political poor possible present private probable quick quiet ready red regular responsible right round same second separate serious sharp smooth sticky stiff straight strong sudden sweet tall thick tight tired true violent waiting warm wet wide wise yellow young
awake bad bent bitter blue certain cold complete cruel dark dead dear delicate different dirty dry false feeble female foolish future green ill last late left loose loud low mixed narrow old opposite public rough sad safe secret short shut simple slow small soft solid special strange thin white wrong
angle ant apple arch arm army baby bag ball band basin basket bath bed bee bell berry bird blade board boat bone book boot bottle box boy brain brake branch brick bridge brush bucket bulb button cake camera card cart carriage cat chain cheese chest chin church circle clock cloud coat collar comb cord cow cup curtain cushion dog door drain drawer dress drop ear egg engine eye face farm feather finger fish flag floor fly foot fork fowl frame garden girl glove goat gun hair hammer hand hat head heart hook horn horse hospital house island jewel kettle key knee knife knot leaf leg library line lip lock map match monkey moon mouth muscle nail neck needle nerve net nose nut office orange oven parcel pen pencil picture pig pin pipe plane plate plough pocket pot potato prison pump rail rat receipt ring rod roof root sail school scissors screw seed sheep shelf ship shirt shoe skin skirt snake sock spade sponge spoon spring square stamp star station stem stick stocking stomach store street sun table tail thread throat thumb ticket toe tongue tooth town train tray tree trousers umbrella wall watch wheel whip whistle window wing wire worm
account act addition adjustment advertisement agreement air amount amusement animal answer apparatus approval argument art attack attempt attention attraction authority back balance base behavior belief birth bit bite blood blow body brass bread breath brother building burn burst business butter canvas care cause chalk chance change cloth coal color comfort committee company comparison competition condition connection control cook copper copy cork cotton cough country cover crack credit crime crush cry current curve damage danger daughter day death debt decision degree design desire destruction detail development digestion direction discovery discussion disease disgust distance distribution division doubt drink driving dust earth edge education effect end error event example exchange existence expansion experience expert fact fall family father fear feeling fiction field fight fire flame flight flower fold food force form friend front fruit glass gold government grain grass grip group growth guide harbor harmony hate hearing heat help history hole hope hour humor ice idea impulse increase industry ink insect instrument insurance interest invention iron jelly join journey judge jump kick kiss knowledge land language laugh law lead learning leather letter level lift light limit linen liquid list look loss love machine man manager mark market mass meal measure meat meeting memory metal middle milk mind mine minute mist money month morning mother motion mountain move music name nation need news night noise note number observation offer oil operation opinion order organization ornament owner page pain paint paper part paste payment peace person place plant play pleasure point poison polish porter position powder power price print process produce profit property protest pull punishment purpose push quality question rain range rate ray reaction reading reason record regret relation religion representative request respect rest reward rhythm rice river road roll room rub rule run salt sand scale science sea seat secretary selection self sense servant sex shade shake shame shape share ship shock shoe shop show side sign silk silver sister size sky sleep slip slope smash smell smile smoke snow soap society son song sort sound soup space stage start statement station steam steel step stone stop store story stretch structure substance sugar suggestion summer support surprise swim system talk taste tax teaching tendency test theory thing thought thunder time tin top touch trade transport trick trouble turn twist unit use value verse view voice walk war wash waste watch water wave wax way weather week weight wind wine winter woman wood wool word work wound writing year
home room door window wall floor roof table chair bed shelf box drawer clock picture light fire key lock garden kitchen bath store shop office school church hospital station bridge street road town country ground floor
food bread meat milk water butter salt sugar soup potato egg fish fruit cake cheese drink rice apple orange berry meal
animal dog cat bird fish horse cow sheep pig goat chicken duck bee ant fly butterfly snake worm rat monkey lion tiger bear fox rabbit
train bus boat ship car cart plane wheel engine ticket station road street bridge rail railway
pen pencil paper book letter newspaper stamp card camera glass lamp bell whistle flag umbrella hammer nail screw needle thread string rope knife fork spoon plate cup pot bottle bag brush comb coin box
man woman boy girl child baby friend father mother son daughter brother sister teacher doctor family person people
coat hat shirt dress shoe boot sock glove skirt trousers cloth button collar pocket ring watch skin hair
sun moon star sky air rain snow wind cloud mountain river sea tree flower leaf grass root seed stone earth water ice fire smoke dust sand wave weather summer winter spring morning evening day night time year month week
good great long little big small high low old new young hot cold warm cool black white red blue green yellow brown grey dark light hard soft thick thin wide narrow deep short fast slow quick loud quiet clean dry wet full empty open shut right wrong true false happy sad angry kind sweet strong beautiful
head hand foot eye ear mouth nose face arm leg heart blood bone tooth finger thumb knee neck back stomach chest shoulder lip tongue nail muscle brain breath
today tomorrow yesterday now then here there
east west north south left right front back middle top bottom side center end start part point line circle square step way road direction distance space place position""".lower().split())

def check_850(sentence):
    """检查句子是否全部由850词组成"""
    words = sentence.lower().replace("'s", "").replace(".", "").replace("?", "").replace(",", "").split()
    bad = []
    for w in words:
        # 处理动词变位
        clean = w
        if clean.endswith("ing") and clean[:-3] in BE850:
            continue
        if clean.endswith("ed") and clean[:-2] in BE850:
            continue
        if clean.endswith("es") and clean[:-2] in BE850:
            continue
        if clean.endswith("s") and clean[:-1] in BE850:
            continue
        if clean.endswith("ly") and clean[:-2] in BE850:
            continue
        if clean.endswith("er") and clean[:-2] in BE850:
            continue
        if clean not in BE850:
            bad.append(w)
    return bad

# 生成新场景句子
new_step3 = []
idx = 9999
for scene_name, sentences_data in NEW_SCENES.items():
    for sd in sentences_data:
        idx += 1
        sent = sd["sentence"]
        zh = sd["note"]
        bad_words = check_850(sent)
        new_step3.append({
            "id": idx,
            "step": 3,
            "type": "scene_sentence",
            "scene": scene_name,
            "sentence": sent,
            "zh": zh,
            "bad_850": bad_words,
        })

print(f"Generated {len(new_step3)} new Step 3 sentences across {len(NEW_SCENES)} scenes")
print(f"\nScenes: {list(NEW_SCENES.keys())}")

# 检查850合规
total_bad = sum(1 for s in new_step3 if s["bad_850"])
total_ok = sum(1 for s in new_step3 if not s["bad_850"])
print(f"\n850 compliance: {total_ok}/{total_ok+total_bad} OK")

# 打印有问题的
for s in new_step3[:5]:
    status = "✅" if not s["bad_850"] else f"❌ {s['bad_850']}"
    print(f"  {status} {s['sentence']}")

# 保存
with open("/tmp/new_step3_scenes.json", "w") as f:
    json.dump(new_step3, f, ensure_ascii=False, indent=2)
print(f"\nSaved to /tmp/new_step3_scenes.json")
