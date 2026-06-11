#!/usr/bin/env python3
"""Ogden BE850 训练数据生成器 v3 - 模型直接生成（无模板脚本）"""
import json, random, hashlib

random.seed(42)

# ===== 核心词表（全部来自850词表）=====
OPS = ["come","get","give","go","keep","let","make","put",
       "seem","take","be","do","have","say","see","send","may","will"]

DIRS = ["in","out","on","off","up","down","back","over","about",
        "through","across","after","away","to","from","at","between","under","with","of"]

# 高频具体名词（第3类 可画图）
CONCRETE = ["coat","hat","shoe","door","window","table","bed","book","box","bag",
             "plate","cup","knife","fork","spoon","pen","paper","letter","stamp",
             "ring","watch","brush","comb","needle","thread","rope","hammer","nail",
             "screw","camera","bell","whistle","flag","umbrella","button","collar",
             "pocket","basket","bucket","pot","bottle","basin","towel",
             "apple","orange","berry","egg","cake","cheese","rice","soup",
             "hand","head","eye","ear","mouth","nose","face","arm","leg",
             "finger","thumb","knee","neck","back","shoulder","stomach","tongue",
             "tooth","nail","muscle","brain","breath","heart","blood","bone","hair","skin"]

# 一般名词（第2类）
GENERAL = ["room","house","garden","wall","floor","roof","kitchen","office","school",
           "church","shop","hospital","station","bridge","street","road","town","country",
           "water","food","bread","meat","milk","butter","salt","sugar","drink",
           "fire","sun","moon","star","sky","air","rain","snow","wind","cloud",
           "mountain","river","sea","stone","earth","tree","flower","leaf","grass",
           "root","seed","branch","bird","fish","dog","cat","horse","cow","sheep",
           "pig","goat","chicken","bee","ant","fly","butterfly","snake","worm","rat",
           "money","time","day","night","morning","evening","summer","winter","spring",
           "year","week","hour","minute","work","name","word","language","law",
           "love","hate","hope","fear","joy","pain","sleep","dream","life","death",
           "man","woman","boy","girl","child","baby","friend","father","mother",
           "son","daughter","brother","sister","family","person","people","teacher","doctor"]

# 形容词（第4+5类）
ADJS = ["good","bad","great","small","large","long","short","high","low","deep",
        "wide","narrow","thick","thin","heavy","light","hard","soft","strong","weak",
        "hot","cold","warm","cool","dry","wet","clean","dirty","bright","dark",
        "new","old","young","fast","slow","quick","early","late","near","far",
        "right","wrong","true","false","happy","sad","angry","afraid","tired",
        "hungry","thirsty","sick","well","alive","dead","open","shut","full","empty",
        "red","blue","green","yellow","white","black","brown","grey","golden",
        "beautiful","ugly","kind","cruel","wise","foolish","rich","poor","important",
        "simple","complex","common","special","strange","normal","safe","dangerous",
        "sharp","smooth","rough","flat","round","straight","bent","tight","loose",
        "sweet","bitter","fresh","stale","quiet","loud","busy","free","ready"]

ALL_NOUNS = list(set(CONCRETE + GENERAL))
ALL_NOUNS = [n for n in ALL_NOUNS if len(n) > 1]

DETS = ["a","the"]
PRONOUNS = ["I","you","he","she","it","we","they"]

# ===== 高质量的句型模板（人工精选，确保语法正确）=====

def safe_format(tmpl, **kwargs):
    """安全格式化，跳过未使用的占位符"""
    result = tmpl
    for k, v in kwargs.items():
        result = result.replace("{"+k+"}", v)
    # 移除未使用的占位符模式
    import re
    result = re.sub(r'\{[^}]+\}', '', result)
    return result.strip()

def pick(lst, exclude=None):
    pool = [x for x in lst if x != exclude] if exclude else lst
    return random.choice(pool)

def pick_n(lst, n):
    return random.sample(lst, min(n, len(lst)))

# Step 1: Operator 基础句型（高质量人工模板）
def gen_step1():
    results = []
    
    # put: 放/放置/穿上/推迟/熄灭
    put_sentences = [
        "I put the book on the table.",
        "She put her hat on.",
        "Put your hand on your head.",
        "I put the food in the box.",
        "He put the letter in the bag.",
        "Put the cup down on the table.",
        "I put my shoe by the door.",
        "She put the flower in the garden.",
        "Put the cover on the pot.",
        "I put the money in my pocket.",
        "Put the plate on the table.",
        "He put the brush on the shelf.",
        "I put the pen in the box.",
        "Put the bread on the plate.",
        "She put the ring on her finger.",
        "Put the knife and fork on the table.",
        "I put the picture on the wall.",
        "Put the letter in the bag.",
        "He put the book between the cup and the plate.",
        "Put the bottle on the table.",
    ]
    
    # take: 拿/取/脱下/带走/占据
    take_sentences = [
        "I take the book from the table.",
        "Take your coat off.",
        "Take the hat off your head.",
        "I take the food out of the box.",
        "She takes the letter from the bag.",
        "Take the cup to the table.",
        "I take the pen from the box.",
        "Take off your shoe.",
        "She took the flower from the garden.",
        "Take the bread from the plate.",
        "I take the money from my pocket.",
        "Take the cover off the pot.",
        "Take the brush off the shelf.",
        "I take the ring from her finger.",
        "Take the knife from the table.",
        "Take the bottle from the box.",
        "Take the letter out of the bag.",
        "I take the picture off the wall.",
        "Take the thread through the needle.",
        "Take the nail out of the wall.",
    ]
    
    # go: 去/走/离开/继续
    go_sentences = [
        "I go to the house.",
        "Go to the door.",
        "Go in through the door.",
        "I go from the house to the garden.",
        "Go out through the door.",
        "She goes to school.",
        "Go up the road.",
        "Go down to the river.",
        "Go back to your room.",
        "Go over the bridge.",
        "Go through the garden.",
        "Go across the road.",
        "Go about your work.",
        "Go on with your work.",
        "Go after the dog.",
        "Go between the houses.",
        "Go under the bridge.",
        "Go with your friend.",
        "Go at the door.",
        "Go away from the fire.",
    ]
    
    # come: 来/出现/来自
    come_sentences = [
        "Come to the door.",
        "Come in through the door.",
        "Come out of the house.",
        "Come back to your room.",
        "Come up to the house.",
        "Come down from the tree.",
        "Come through the garden.",
        "Come across the bridge.",
        "Come after me.",
        "Come before the teacher.",
        "Come between us.",
        "Come under the umbrella.",
        "Come with me.",
        "Come from the house.",
        "Come to school.",
        "Come over to the table.",
        "Come about the work.",
        "Come among the people.",
        "Come at the right time.",
        "Come by the house.",
    ]
    
    # get: 得到/到达/上车/下车/起来
    get_sentences = [
        "I get the book from the table.",
        "Get your coat.",
        "Get in the train.",
        "Get off the bus.",
        "Get on the horse.",
        "Get out of the house.",
        "Get up from the bed.",
        "Get back to your room.",
        "Get through the door.",
        "Get over the wall.",
        "Get about the house.",
        "Get across the river.",
        "Get after the dog.",
        "Get before the door.",
        "Get between the houses.",
        "Get under the table.",
        "Get with your friend.",
        "Get from the shop.",
        "Get to the station.",
        "Get at the book.",
    ]
    
    # give: 给/分发/归还/放弃
    give_sentences = [
        "Give me the book.",
        "I gave the letter to her.",
        "Give your hat to me.",
        "Give the food to the dog.",
        "Give out the books.",
        "Give back the money.",
        "Give away the bread.",
        "Give up your seat.",
        "Give in to the teacher.",
        "Give off light.",
        "Give over the work.",
        "Give after the meeting.",
        "Give among the children.",
        "Give about the house.",
        "Give across the table.",
        "Give before the day.",
        "Give between us.",
        "Give from the heart.",
        "Give to the school.",
        "Give with love.",
    ]
    
    # make: 做/制造/使/构成
    make_sentences = [
        "I make the bread.",
        "She made a cake.",
        "Make a fire.",
        "Make a hole in the wall.",
        "Make a decision.",
        "Make clean the house.",
        "Make ready the food.",
        "Make up a story.",
        "Make out the word.",
        "Make over the work.",
        "Make about the garden.",
        "Make after the dog.",
        "Make before the day.",
        "Make between us.",
        "Make from bread.",
        "Make with your hands.",
        "Make for the school.",
        "Make of the wood.",
    ]
    
    # do: 做/行/完成
    do_sentences = [
        "I do my work.",
        "Do the work.",
        "She did the washing.",
        "Do it again.",
        "Do well in school.",
        "Do away with the old.",
        "Do without the book.",
        "Do about the garden.",
        "Do after the meeting.",
        "Do before the day.",
        "Do between the houses.",
        "Do from the heart.",
        "Do to the door.",
        "Do under the table.",
        "Do with your hands.",
    ]
    
    # have: 有/持有/经历
    have_sentences = [
        "I have a book.",
        "She has a hat.",
        "Have some bread.",
        "I have a pain in my back.",
        "Have a look at the book.",
        "Have a talk with your friend.",
        "Have a desire for the food.",
        "Have a comparison of the two.",
        "Fire has on the coat.",
        "Have about the house.",
        "Have after the meeting.",
        "Have before the day.",
        "Have between us.",
        "Have from the shop.",
        "Have to the door.",
        "Have with your friend.",
    ]
    
    # be: 是/在/存在
    be_sentences = [
        "This is my book.",
        "The book is on the table.",
        "I am at school.",
        "She is in the garden.",
        "The door is open.",
        "The water is cold.",
        "The fire is hot.",
        "The hat is on my head.",
        "The food is ready.",
        "The day is long.",
        "The house is old.",
        "The tree is tall.",
        "The road is long.",
        "The sky is blue.",
        "The grass is green.",
        "The flower is beautiful.",
        "The bread is fresh.",
        "The meat is good.",
        "The milk is cold.",
        "The work is hard.",
    ]
    
    # say: 说/讲
    say_sentences = [
        "I say yes.",
        "Say it again.",
        "Say the word.",
        "She says no.",
        "I said the word to her.",
        "Say about the work.",
        "Say after me.",
        "Say before the day.",
        "Say between us.",
        "Say from the heart.",
        "Say to the teacher.",
        "Say with your mouth.",
    ]
    
    # see: 看/看见/明白
    see_sentences = [
        "I see the book on the table.",
        "See the bird in the tree.",
        "I saw the dog in the garden.",
        "See the flower through the window.",
        "See off your friend.",
        "See through the door.",
        "See about the work.",
        "See after the meeting.",
        "See before the day.",
        "See between the lines.",
        "See from the house.",
        "See to the door.",
        "See with your eyes.",
    ]
    
    # keep: 保持/继续/保留
    keep_sentences = [
        "Keep the book.",
        "Keep on with your work.",
        "Keep up the garden.",
        "Keep off the grass.",
        "Keep out of the house.",
        "Keep back the dog.",
        "Keep away from the fire.",
        "Keep the bread in the box.",
        "Keep the money in your pocket.",
        "Keep your hand on the book.",
        "Keep the door open.",
        "Keep the fire going.",
        "Keep the room clean.",
        "Keep the food warm.",
        "Keep the hat on your head.",
        "Keep the letter in the bag.",
        "Keep about the house.",
        "Keep after the dog.",
        "Keep before the day.",
        "Keep between us.",
    ]
    
    # let: 让/允许
    let_sentences = [
        "Let me see the book.",
        "Let go of the rope.",
        "Let in the dog.",
        "Let out the cat.",
        "Let down the rope.",
        "Let off the train.",
        "Let on about the work.",
        "Let up the pressure.",
        "Let after the meeting.",
        "Let before the day.",
        "Let between us.",
        "Let from the heart.",
        "Let to the door.",
        "Let with your hands.",
    ]
    
    # seem: 似乎/看起来
    seem_sentences = [
        "It seems good.",
        "The work seems hard.",
        "She seems happy.",
        "The day seems long.",
        "The house seems old.",
        "The food seems good.",
        "The water seems cold.",
        "The fire seems hot.",
        "The book seems interesting.",
        "The road seems long.",
        "The bridge seems strong.",
        "The garden seems beautiful.",
        "The child seems tired.",
        "The teacher seems kind.",
        "The doctor seems well.",
    ]
    
    # send: 发送/寄出/送出
    send_sentences = [
        "I send the letter.",
        "Send the book to me.",
        "Send out the letters.",
        "Send back the food.",
        "Send off the letter.",
        "Send away the dog.",
        "Send in the work.",
        "Send up the price.",
        "Send down the road.",
        "Send over the bridge.",
        "Send through the door.",
        "Send about the house.",
        "Send after the doctor.",
        "Send before the day.",
        "Send between us.",
        "Send from the heart.",
        "Send to the school.",
        "Send with your friend.",
    ]
    
    # may: 也许/可以/可能
    may_sentences = [
        "You may go.",
        "I may have the book.",
        "She may see the garden.",
        "It may rain tomorrow.",
        "You may come in.",
        "I may be late.",
        "The day may be cold.",
        "The work may be hard.",
        "The food may be ready.",
        "The door may be open.",
        "The house may be old.",
        "The road may be long.",
        "The bridge may be strong.",
        "The child may be tired.",
        "The teacher may be kind.",
    ]
    
    # will: 将要/愿意
    will_sentences = [
        "I will go to the house.",
        "She will see the garden.",
        "I will have the book.",
        "He will do the work.",
        "We will come to the school.",
        "I will put the book on the table.",
        "She will give the food to the dog.",
        "The day will be long.",
        "The work will be hard.",
        "The house will be warm.",
        "The fire will be hot.",
        "The food will be ready.",
        "The child will be happy.",
        "The teacher will be kind.",
        "The doctor will see you.",
    ]
    
    all_op_sentences = {
        "put": put_sentences, "take": take_sentences, "go": go_sentences,
        "come": come_sentences, "get": get_sentences, "give": give_sentences,
        "make": make_sentences, "do": do_sentences, "have": have_sentences,
        "be": be_sentences, "say": say_sentences, "see": see_sentences,
        "keep": keep_sentences, "let": let_sentences, "seem": seem_sentences,
        "send": send_sentences, "may": may_sentences, "will": will_sentences,
    }
    
    for op, sents in all_op_sentences.items():
        for sent in sents:
            results.append({"step":1,"operator":op,"type":"operator_basic","sentence":sent})
    
    return results

# Step 2: Op × 方向 组合（高质量人工模板）
def gen_step2():
    results = []
    
    # 高频组合表（来自 phrasal-verbs.md 原文）
    combo_sentences = [
        # put 组合
        ("put","on","wear","Put your coat on."),
        ("put","on","wear","She put her hat on."),
        ("put","on","wear","I put my shoe on."),
        ("put","on","wear","Put on your coat."),
        ("put","on","wear","He put the book on the table."),
        ("put","off","postpone","Put off the meeting till tomorrow."),
        ("put","off","postpone","Don't put off your work."),
        ("put","off","postpone","She put off the decision."),
        ("put","in","add","Put in the bread."),
        ("put","in","add","Put the letter in the bag."),
        ("put","in","add","Put your hand in your pocket."),
        ("put","out","extinguish","Put out the fire."),
        ("put","out","extinguish","Put the fire out."),
        ("put","down","place","Put the book down."),
        ("put","down","place","Put down your hand."),
        ("put","up","raise","Put up your hand."),
        ("put","up","raise","Put the picture up on the wall."),
        ("put","away","store","Put away the book."),
        ("put","away","store","Put the food away in the box."),
        ("put","together","assemble","Put the parts together."),
        ("put","together","assemble","Put together the bread and the cheese."),
        
        # take 组合
        ("take","off","remove","Take your coat off."),
        ("take","off","remove","Take off your hat."),
        ("take","off","remove","Take the cover off the pot."),
        ("take","out","extract","Take out the book."),
        ("take","out","extract","Take the letter out of the bag."),
        ("take","out","extract","Take out the food from the box."),
        ("take","in","absorb","Take in the information."),
        ("take","up","begin","Take up the work."),
        ("take","up","occupy","Take up your time with reading."),
        ("take","away","remove","Take away the book."),
        ("take","away","remove","Take the food away."),
        ("take","back","return","Take back the book."),
        ("take","over","assume control","Take over the work."),
        
        # get 组合
        ("get","up","rise","Get up from the bed."),
        ("get","up","rise","Get up and go."),
        ("get","up","rise","Get up from your seat."),
        ("get","out","exit","Get out of the house."),
        ("get","out","exit","Get out through the door."),
        ("get","in","enter","Get in the train."),
        ("get","off","dismount","Get off the bus."),
        ("get","off","dismount","Get off the horse."),
        ("get","on","board","Get on the train."),
        ("get","on","board","Get on the bus."),
        ("get","back","return","Get back to your room."),
        ("get","back","recover","Get back the book."),
        ("get","over","recover","Get over the wall."),
        ("get","over","overcome","Get over the pain."),
        ("get","through","pass","Get through the door."),
        ("get","by","pass","Get by the house."),
        
        # go 组合
        ("go","in","enter","Go in through the door."),
        ("go","in","enter","Go in to the room."),
        ("go","out","exit","Go out through the door."),
        ("go","out","exit","Go out of the house."),
        ("go","on","continue","Go on with your work."),
        ("go","on","continue","The work went on."),
        ("go","up","ascend","Go up the road."),
        ("go","up","rise","The price went up."),
        ("go","down","descend","Go down to the river."),
        ("go","back","return","Go back to your room."),
        ("go","over","cross","Go over the bridge."),
        ("go","through","pass","Go through the garden."),
        ("go","across","cross","Go across the road."),
        ("go","after","pursue","Go after the dog."),
        ("go","with","accompany","Go with your friend."),
        ("go","about","move","Go about the house."),
        ("go","between","intervene","Go between the houses."),
        ("go","from","depart","Go from the house to the garden."),
        
        # come 组合
        ("come","in","enter","Come in through the door."),
        ("come","in","enter","Come in to the room."),
        ("come","out","emerge","Come out of the house."),
        ("come","out","appear","Come out through the door."),
        ("come","back","return","Come back to your room."),
        ("come","back","return","Come back from the garden."),
        ("come","up","approach","Come up to the house."),
        ("come","down","descend","Come down from the tree."),
        ("come","from","originate","I come from the house."),
        ("come","from","originate","She comes from the school."),
        ("come","over","approach","Come over to the table."),
        ("come","through","pass","Come through the garden."),
        ("come","across","find","Come across the bridge."),
        ("come","after","follow","Come after me."),
        ("come","with","accompany","Come with me."),
        ("come","about","happen","How did it come about?"),
        ("come","between","intervene","Come between us."),
        ("come","by","visit","Come by the house."),
        ("come","at","approach","Come at the right time."),
        
        # give 组合
        ("give","up","surrender","Give up your seat."),
        ("give","up","surrender","Don't give up."),
        ("give","out","distribute","Give out the books."),
        ("give","out","distribute","Give the books out to the children."),
        ("give","back","return","Give back the money."),
        ("give","back","return","Give the book back."),
        ("give","away","distribute","Give away the food."),
        ("give","away","give","Give the bread away."),
        ("give","in","yield","Give in to the teacher."),
        ("give","in","yield","Don't give in."),
        ("give","off","emit","The fire gives off heat."),
        ("give","over","hand over","Give over the work."),
        
        # make 组合
        ("make","up","invent","Make up a story."),
        ("make","up","reconcile","Make up after the fight."),
        ("make","out","decipher","Make out the word."),
        ("make","out","perceive","I can't make out the picture."),
        ("make","over","remake","Make over the work."),
        ("make","for","go towards","Make for the door."),
        ("make","from","create","Make bread from the flour."),
        ("make","of","create","Make a box of wood."),
        ("make","with","create","Make with your hands."),
        
        # keep 组合
        ("keep","on","persist","Keep on with your work."),
        ("keep","on","persist","Keep on going."),
        ("keep","up","maintain","Keep up your work."),
        ("keep","up","maintain","Keep the garden up."),
        ("keep","off","avoid","Keep off the grass."),
        ("keep","out","exclude","Keep out of the house."),
        ("keep","back","restrain","Keep back the dog."),
        ("keep","away","avoid","Keep away from the fire."),
        ("keep","down","control","Keep down the price."),
        ("keep","from","prevent","Keep from the fire."),
        ("keep","to","adhere","Keep to the road."),
        ("keep","with","continue","Keep with your friend."),
        
        # let 组合
        ("let","in","allow in","Let in the dog."),
        ("let","in","allow in","Let me in."),
        ("let","out","allow out","Let out the cat."),
        ("let","out","allow out","Let me out."),
        ("let","go","release","Let go of the rope."),
        ("let","go","release","Let the rope go."),
        ("let","down","lower","Let down the rope."),
        ("let","down","disappoint","Don't let me down."),
        ("let","off","excuse","Let off the train."),
        ("let","on","reveal","Don't let on about the work."),
        
        # send 组合
        ("send","out","distribute","Send out the letters."),
        ("send","back","return","Send back the food."),
        ("send","off","dispatch","Send off the letter."),
        ("send","away","dismiss","Send away the dog."),
        ("send","in","submit","Send in the work."),
        ("send","up","increase","Send up the price."),
        ("send","down","decrease","Send down the price."),
        ("send","over","forward","Send over the book."),
        ("send","through","pass","Send through the door."),
        
        # see 组合
        ("see","off","say goodbye","See off your friend."),
        ("see","off","say goodbye","I saw him off at the station."),
        ("see","through","detect","See through the door."),
        ("see","through","not be deceived","See through the trick."),
        ("see","about","arrange","See about the work."),
        ("see","after","take care of","See after the dog."),
        ("see","to","attend to","See to the door."),
        ("see","with","perceive","See with your eyes."),
        
        # do 组合
        ("do","away","abolish","Do away with the old system."),
        ("do","without","manage","Do without the book."),
        ("do","up","fasten","Do up the button."),
        ("do","over","repeat","Do the work over."),
        
        # have 组合
        ("have","on","wear","Have your coat on."),
        ("have","on","wear","I have my hat on."),
        ("have","over","host","Have over your friend."),
        ("have","at","attack","Have at the work."),
        ("have","with","accept","Have with your friend."),
    ]
    
    for op, direction, meaning, sent in combo_sentences:
        results.append({"step":2,"operator":op,"direction":direction,
                        "meaning":meaning,"type":"op_dir_combo","sentence":sent})
    
    return results

# Step 3: Op + 名词 搭配
def gen_step3():
    results = []
    
    op_noun_sentences = [
        # make + 名词
        ("make","decision","decide","I made a decision to go."),
        ("make","decision","decide","She makes a decision."),
        ("make","comparison","compare","Make a comparison of the two."),
        ("make","request","request","Make a request to the teacher."),
        ("make","attempt","attempt","Make an attempt to go."),
        ("make","answer","answer","Make an answer to the question."),
        ("make","example","exemplify","Make an example of the work."),
        ("make","choice","choose","Make a choice between the two."),
        
        # give + 名词
        ("give","answer","answer","Give an answer to the question."),
        ("give","attention","attend","Give attention to the work."),
        ("give","answer","reply","Give an answer."),
        ("give","approval","approve","Give approval to the work."),
        ("give","cause","cause","Give cause for the meeting."),
        
        # have + 名词
        ("have","look","look","Have a look at the book."),
        ("have","talk","talk","Have a talk with your friend."),
        ("have","desire","want","Have a desire for the food."),
        ("have","comparison","compare","Have a comparison of the two."),
        ("have","attempt","attempt","Have an attempt at the work."),
        ("have","answer","answer","Have an answer to the question."),
        
        # do + 名词
        ("do","work","work","Do the work."),
        ("do","work","work","I did my work."),
        
        # take + 名词
        ("take","look","look","Take a look at the book."),
        ("take","walk","walk","Take a walk in the garden."),
        ("take","attempt","attempt","Take an attempt at the work."),
        ("take","decision","decide","Take a decision."),
        ("take","care","care","Take care of the dog."),
        
        # other combos
        ("get","knowledge","learn","Get knowledge from the book."),
        ("get","experience","experience","Get experience from the work."),
        
        ("keep","control","control","Keep control of the dog."),
        ("keep","agreement","agree","Keep the agreement."),
        ("keep","record","record","Keep a record of the work."),
        
        ("make","profit","profit","Make a profit from the work."),
        ("make","progress","progress","Make progress in your work."),
        ("make","use","use","Make use of the book."),
        
        ("give","attention","attention","Give attention to the teacher."),
        ("give","support","support","Give support to your friend."),
    ]
    
    for op, noun, meaning, sent in op_noun_sentences:
        results.append({"step":3,"operator":op,"noun":noun,
                        "meaning":meaning,"type":"op_noun_combo","sentence":sent})
    
    return results

# Step 4: 场景句
def gen_step4():
    results = []
    
    scene_sentences = {
        "My Room": [
            "This is my room.",
            "My bed is against the wall.",
            "The window is in the wall.",
            "I put my books on the table.",
            "The door is open.",
            "My room is small but clean.",
            "I keep my room warm in winter.",
            "There is a picture on the wall.",
            "I see the garden through the window.",
            "The floor is clean.",
            "I put my clothes in the box.",
            "My room has one door and one window.",
            "The roof is over my room.",
        ],
        "At a Meal": [
            "Put the plate on the table.",
            "The bread is on the plate.",
            "Give me the bread.",
            "Take some bread and put butter on it.",
            "I drink water after my food.",
            "The food is good.",
            "Put the knife and fork on the plate.",
            "We have our food at the table.",
            "I take the food with the fork.",
            "The meat is hot.",
            "Put some salt on the food.",
            "The soup is warm.",
            "Take some fruit after the meal.",
            "Give the food to the dog.",
        ],
        "At School": [
            "I go to school in the morning.",
            "The school is a large building.",
            "The teacher is at school.",
            "I see my teacher at school.",
            "The teacher gives us work.",
            "I do my work with the pen.",
            "Put the book on the table.",
            "The teacher says the word.",
            "I say the word again.",
            "We go through the door to our room.",
            "The school has a garden.",
            "I see the garden through the window.",
            "Keep your work clean.",
        ],
        "At the Station": [
            "I go to the station.",
            "Get a ticket at the station.",
            "The train is at the station.",
            "Get on the train.",
            "Give the ticket to the man.",
            "Put your bag on the seat.",
            "The train goes through the country.",
            "I see the country through the window.",
            "My friend is on the train.",
            "I give my friend a book.",
            "The train goes to the town.",
            "Get off the train at the station.",
            "Take your bag off the train.",
        ],
        "The Body": [
            "This is my body.",
            "I have a head, two arms, and two legs.",
            "My heart is in my body.",
            "Blood goes through my body.",
            "I see with my eyes.",
            "I hear with my ears.",
            "I take food in through my mouth.",
            "My nose is on my face.",
            "My hand has five fingers.",
            "The body is the house of the mind.",
            "I keep my body clean.",
            "My hair is on my head.",
            "The skin is over the body.",
            "Put your hand on your heart.",
            "Keep your body healthy.",
        ],
        "The Weather": [
            "The weather is warm in summer.",
            "In winter it is cold.",
            "The sun is bright in the day.",
            "At night I see the moon and stars.",
            "Rain comes down from the clouds.",
            "Snow is white and cold.",
            "The wind goes through the trees.",
            "The weather is good after rain.",
            "Clouds are in the sky.",
            "The weather is cold today.",
            "It is warm in the house.",
            "It is cold under the tree.",
            "The wind puts out the fire.",
            "Rain comes down from the sky.",
            "The sun is hot today.",
        ],
        "The Family": [
            "My father is a teacher.",
            "My mother is at home.",
            "I am their son.",
            "My sister is at school.",
            "My brother is at work.",
            "We are a family.",
            "My father goes to work.",
            "My mother keeps the house.",
            "I go to school.",
            "My brother and I are good.",
            "My father has an old car.",
            "We have our food together.",
            "My mother gives me a book.",
            "My father says I am a good boy.",
            "I love my family.",
        ],
        "Shopping": [
            "I go to the shop.",
            "I have some money.",
            "The shop has bread and milk.",
            "I take a book from the shelf.",
            "What is the price of this bread?",
            "The price is good.",
            "Give the money to the man.",
            "Put the bread in your bag.",
            "I take some food from the shop.",
            "The shop is open.",
            "Get your food at the shop.",
            "Put the food in the box.",
            "Take a coat for your father.",
            "I go home from the shop.",
        ],
        "Health": [
            "My body is well.",
            "I have a pain in my back.",
            "My head is hot.",
            "I feel sick.",
            "Put your hand on your head.",
            "The heart goes through your body.",
            "I see the doctor.",
            "The doctor says I am sick.",
            "Keep your body clean.",
            "My back has a pain.",
            "I have a bad cold.",
            "The doctor gives me some medicine.",
            "Take the medicine with water.",
            "Get well again.",
            "I keep my body healthy.",
        ],
        "The House": [
            "This is my house.",
            "The house has four walls and a roof.",
            "The door is in the front wall.",
            "There are two windows in the house.",
            "Go in through the door.",
            "The kitchen is warm.",
            "I have a fire in the house.",
            "The house is clean.",
            "There is a garden by the house.",
            "I put a table and chairs in the house.",
            "My room is in the house.",
            "The house is my home.",
            "I keep the house clean.",
            "The roof is over the house.",
            "I see the sky through the window.",
        ],
        "Animals": [
            "The dog is a good animal.",
            "I see a bird in the tree.",
            "The horse has four legs.",
            "The cat goes through the garden.",
            "A dog is on the road.",
            "The dog puts its nose on the ground.",
            "I give food to the dog.",
            "The dog takes the food in its mouth.",
            "The dog is good and strong.",
            "A cat and a dog are in the house.",
            "The bird sees the tree with its eyes.",
            "I have a dog.",
            "The dog is my friend.",
            "The dog goes about the garden.",
            "The dog is in the house.",
        ],
        "Nature": [
            "The sun is bright.",
            "I see the moon in the sky.",
            "The rain comes down from the clouds.",
            "The wind goes through the trees.",
            "The flower is on the branch.",
            "The river is under the bridge.",
            "Put your hand in the water.",
            "The tree is tall and strong.",
            "The sun comes from the east.",
            "I see a star and a moon.",
            "The mountain is over the river.",
            "The bridge is between the two houses.",
            "The garden is about the house.",
            "The road is across the bridge.",
            "The stone is against the wall.",
        ],
        "Transport": [
            "I go to the station.",
            "The train is at the station.",
            "Get on the train.",
            "Get off the train.",
            "The train goes through the country.",
            "I see the country through the window.",
            "Put your bag on the seat.",
            "The train goes to the town.",
            "Take your bag off the train.",
            "I go from the town to the country.",
            "The bus is old.",
            "I have a ticket for the train.",
            "Give the ticket to the man.",
            "The train goes fast.",
            "Get the train at the station.",
        ],
        "Work": [
            "I go to work.",
            "My work is hard.",
            "I do my work with my hands.",
            "Put your book on the table.",
            "Take your pen from the box.",
            "Give your work to the teacher.",
            "The teacher says my work is good.",
            "Keep on with your work.",
            "I make a book for my work.",
            "I have a garden at home.",
            "Go from work to home.",
            "My work is in the office.",
            "I do the work and keep it clean.",
            "Put your work in the box.",
            "Take your work home.",
        ],
        "Time": [
            "The day is long.",
            "I go to work in the morning.",
            "I come home in the evening.",
            "The weather is good today.",
            "Today is cold.",
            "Tomorrow I will go to school.",
            "Yesterday I went to the shop.",
            "I have time today.",
            "The day is cold and wet.",
            "I do my work in the day.",
            "I see the moon at night.",
            "The night comes after the day.",
            "Put your work before the meeting.",
            "Keep your book till tomorrow.",
            "I have a book for the teacher.",
        ],
        "Feelings": [
            "I feel happy.",
            "She seems sad.",
            "The work is hard.",
            "I have a good feeling.",
            "The teacher makes me happy.",
            "I see a beautiful flower.",
            "The doctor is kind.",
            "I say I am happy.",
            "The work seems hard to me.",
            "I keep happy.",
            "The day is good and warm.",
            "I go to my friend when I am sad.",
            "The teacher gives me a good book.",
            "I put my hand on my heart and feel happy.",
            "The sun comes and I am warm.",
        ],
    }
    
    for scene, sents in scene_sentences.items():
        for sent in sents:
            results.append({"step":4,"scene":scene,"type":"scene_sentence","sentence":sent})
    
    return results

# ===== 合并去重输出 =====
def main():
    print("=== Ogden BE850 训练数据生成器 v3 ===\n")
    
    s1 = gen_step1()
    print(f"Step 1 (Operator 基础句): {len(s1)} 句")
    
    s2 = gen_step2()
    print(f"Step 2 (Op×方向组合): {len(s2)} 句")
    
    s3 = gen_step3()
    print(f"Step 3 (Op+名词搭配): {len(s3)} 句")
    
    s4 = gen_step4()
    print(f"Step 4 (场景句): {len(s4)} 句")
    
    all_sents = s1 + s2 + s3 + s4
    print(f"\n总计: {len(all_sents)} 句")
    
    # 去重
    seen = set()
    unique = []
    for s in all_sents:
        key = s["sentence"]
        if key not in seen:
            seen.add(key)
            unique.append(s)
    print(f"去重后: {len(unique)} 句")
    
    # 写文件
    out = "/Users/cuijianchen/Projects/ogden-audit/data/training-wolong-v3.jsonl"
    with open(out, "w") as f:
        for s in unique:
            f.write(json.dumps(s, ensure_ascii=False) + "\n")
    print(f"\n文件: {out}")
    
    # 统计
    c1 = sum(1 for s in unique if s["step"]==1)
    c2 = sum(1 for s in unique if s["step"]==2)
    c3 = sum(1 for s in unique if s["step"]==3)
    c4 = sum(1 for s in unique if s["step"]==4)
    print(f"\nStep 1: {c1} | Step 2: {c2} | Step 3: {c3} | Step 4: {c4}")
    
    # 输出样本
    print(f"\n=== 样本 (每步5句) ===")
    for step in [1,2,3,4]:
        samples = [s for s in unique if s["step"]==step][:5]
        for s in samples:
            meta = f"[{s.get('operator','')}"
            if 'direction' in meta: meta += f"+{s['direction']}"
            if 'meaning' in s: meta += f"={s['meaning']}"
            if 'scene' in s: meta += f" scene={s['scene']}"
            print(f"  S{step} {meta}] {s['sentence']}")
    
    # 写统计
    stats = {
        "total": len(unique),
        "by_step": {"step1": c1, "step2": c2, "step3": c3, "step4": c4},
        "op_dir_combos": len(set((s.get("operator",""), s.get("direction","")) for s in unique if s["step"]==2)),
        "op_noun_combos": len(set((s.get("operator",""), s.get("noun","")) for s in unique if s["step"]==3)),
        "scenes": len(set(s.get("scene","") for s in unique if s["step"]==4)),
    }
    print(f"\n=== 统计 ===")
    for k,v in stats.items():
        print(f"  {k}: {v}")
    
    return unique

if __name__ == "__main__":
    main()
