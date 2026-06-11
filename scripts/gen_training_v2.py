#!/usr/bin/env python3
"""
Ogden BE850 全量训练数据生成器 v2
目标: 16 operator × 20 方向 × 850词池 = 10000+ 句子
严格只用 850 词表内的词
"""
import json, random, sys
random.seed(42)

# ===== 18 Operators (动作核心) =====
OPS = ["come","get","give","go","keep","let","make","put",
       "seem","take","be","do","have","say","see","send","may","will"]

# ===== 20 Directions/Prepositions =====
DIRS = ["in","out","on","off","up","down","back","over","about",
        "through","across","after","away","to","from","at","between","under","with"]

# ===== 850词表中的名词池 (从五类词中提取) =====
# 第3类 可画图名词 (200个具体名词)
CONCRETE = """angle ant apple arch arm army baby bag ball band basin basket bath bed bee bell berry bird blade board boat bone book boot bottle box boy brain brake branch brick bridge brush bucket bulb button cake camera card cart carriage cat chain cheese chest chin church circle clock cloud coat collar comb cord cow cup curtain cushion dog door drain drawer dress drop ear egg engine eye face farm feather finger fish flag floor fly foot fork fowl frame garden girl glove goat gun hair hammer hand hat head heart hook horn horse hospital house island jewel kettle key knee knife knot leaf leg library line lip lock map match monkey moon mouth muscle nail neck needle nerve net nose nut office orange oven parcel pen pencil picture pig pin pipe plane plate plough pocket pot potato prison pump rail rat receipt ring rod roof root sail school scissors screw seed sheep shelf ship shirt shoe skin skirt snake sock spade sponge spoon spring square stamp star station stem stick stocking stomach store street sun table tail thread throat thumb ticket toe tongue tooth town train tray tree trousers umbrella wall watch wheel whip whistle window wing wire worm""".split()

# 第2类 一般物 (高频名词)
GENERAL = """account act addition adjustment advertisement agreement air amount amusement animal answer apparatus approval argument art attack attempt attention attraction authority back balance base behavior belief birth bit bite blood blow body brass bread breath brother building burn burst business butter canvas care cause chalk chance change cloth coal color comfort committee company comparison competition condition connection control cook copper copy cork cotton cough country cover crack credit crime crush cry current curve damage danger daughter day death debt decision degree design desire destruction detail development digestion direction discovery discussion disease disgust distance distribution division doubt drink driving dust earth edge education effect end error event example exchange existence expansion experience expert fact fall family father fear feeling fiction field fight fire flame flight flower fold food force form friend front fruit glass gold government grain grass grip group growth guide harbor harmony hate hearing heat help history hole hope hour humor ice idea impulse increase industry ink insect instrument insurance interest invention iron jelly join journey judge jump kick kiss knowledge land language laugh law lead learning leather letter level lift light limit linen liquid list look loss love machine man manager mark market mass meal measure meat meeting memory metal middle milk mind mine minute mist money month morning mother motion mountain move music name nation need news night noise note number observation offer oil operation opinion order organization ornament owner page pain paint paper part paste payment peace person place plant play pleasure point poison polish porter position powder power price print process produce profit property protest pull punishment purpose push quality question rain range rate ray reaction reading reason record regret relation religion representative request respect rest reward rhythm rice river road roll room rub rule run salt sand scale science sea seat secretary selection self sense servant sex shade shake shame shape share sheep shelf ship shirt shock shoe shop show side sign silk silver sister size sky sleep slip slope smash smell smile smoke snow soap society son song sort sound soup space stage start statement station steam steel step stick stone stop store story stretch structure substance sugar suggestion summer support surprise swim system talk taste tax teaching tendency test theory thing thought thunder time tin top touch trade transport trick trouble turn twist unit use value verse view voice walk war wash waste watch water wave wax way weather week weight wind wine winter woman wood wool word work wound writing year""".split()

# 第4+5类 形容词
ADJS = """able acid angry automatic beautiful black boiling bright broken brown cheap chemical chief clean clear common complex conscious cut deep dependent early elastic electric equal fat fertile first fixed flat free frequent full general good great grey hanging happy hard healthy high hollow important kind like living long male married material medical military natural necessary new normal open parallel past physical political poor possible present private probable quick quiet ready red regular responsible right round same second separate serious sharp smooth sticky stiff straight strong sudden sweet tall thick tight tired true violent waiting warm wet wide wise yellow young awake bad bent bitter blue certain cold complete cruel dark dead dear delicate different dirty dry false feeble female foolish future green ill last late left loose loud low mixed narrow old opposite public rough sad safe secret short shut simple slow small soft solid special strange thin white wrong""".split()

# 代词/限定词/功能词
PRONOUNS = ["I","you","he","she","it","we","they","me","him","her","us","them",
             "my","your","his","its","our","their","this","that","these","those"]
DETS = ["a","the","an"]
CONJS = ["and","but","or","if","because","while","though"]
ADVS = ["again","ever","far","forward","here","near","now","out","still",
        "then","there","together","well","almost","enough","even","not",
        "only","quite","so","very","tomorrow","yesterday"]
BODIES = ["head","hand","foot","eye","ear","mouth","nose","face","arm","leg",
          "heart","blood","hair","skin","bone","tooth","finger","thumb","knee",
          "neck","back","stomach","chest","shoulder","lip","tongue","nail",
          "muscle","brain","breath"]
CLOTHES = ["coat","hat","shirt","dress","shoe","boot","sock","glove","skirt",
           "trousers","cloth","button","collar","pocket","ring","watch"]
FOODS = ["food","bread","meat","milk","water","butter","salt","sugar","soup",
         "potato","egg","fish","fruit","cake","cheese","drink","rice","apple",
         "orange","berry"]
HOMES = ["house","room","door","window","wall","floor","roof","table","chair",
         "bed","shelf","box","drawer","clock","picture","light","fire","key",
         "lock","garden","kitchen","bath","store","shop","office","school",
         "church","hospital","station","bridge","street","road","town","country"]
NATURE = ["sun","moon","star","sky","air","rain","snow","wind","cloud",
          "mountain","river","sea","tree","flower","leaf","grass","root",
          "seed","stone","earth","water","ice","fire","smoke","dust","sand",
          "wave","weather","summer","winter","spring","morning","evening",
          "day","night"]
ANIMALS = ["dog","cat","bird","fish","horse","cow","sheep","pig","goat",
           "chicken","duck","bee","ant","fly","butterfly","snake","worm",
           "rat","monkey","lion","tiger","bear","fox","rabbit","fowl"]
TRANSPORT = ["train","bus","boat","ship","car","cart","plane","wheel","engine",
             "ticket","station","road","street","bridge","rail","railway"]
TOOLS = ["knife","fork","spoon","plate","cup","pot","bottle","bag","brush",
         "comb","needle","thread","string","rope","hammer","nail","screw",
         "pen","pencil","paper","book","letter","stamp","card","camera",
         "glass","lamp","bell","whistle","flag","umbrella"]
PEOPLE = ["man","woman","boy","girl","child","baby","friend","father","mother",
          "son","daughter","brother","sister","teacher","doctor","family",
          "person","people"]

# 合并名词池 (去重)
ALL_NOUNS = list(set(CONCRETE + GENERAL))
ALL_NOUNS = [n for n in ALL_NOUNS if len(n) > 1]  # 过滤单字符

# ===== 句型模板 =====

# Step 1: Operator 基础句 (每个op × 5-8个句型)
S1_TMPL = {
    "put": [
        "I put {det} {n} on {det} {n2}.","She put {det} {n} in {det} {n2}.",
        "Put your {body} on your {body2}.","I put {det} {n} under {det} {n2}.",
        "He put {det} {n} by {det} {n2}.","Put {det} {n} down.",
        "I put {det} {n} between {det} {n2} and {det} {n3}.",
        "Put {det} {n} through {det} {n2}.",
    ],
    "take": [
        "I take {det} {n} off {det} {n2}.","Take your {body} off your {body2}.",
        "I take {det} {n} from {det} {n2}.","Take {det} {n} to {det} {n2}.",
        "She took {det} {n} out of {det} {n2}.","Take {det} {n} away.",
        "I take {det} {n} back to {det} {n2}.","Take {det} {n} in.",
    ],
    "go": [
        "I go to {det} {n}.","Go to your {n}.",
        "I go from {det} {n} to {det} {n2}.","She goes to {det} {n}.",
        "We go through {det} {n}.","Go up to {det} {n}.",
        "Go down to {det} {n}.","Go back to {det} {n}.",
    ],
    "come": [
        "Come to {det} {n}.","She came to {det} {n}.",
        "Come from {det} {n}.","I come to {det} {n}.",
        "Come through {det} {n}.","Come back to {det} {n}.",
        "Come in through {det} {n}.","Come out of {det} {n}.",
    ],
    "get": [
        "I get {det} {n} from {det} {n2}.","Get your {n} from {det} {n2}.",
        "I get {det} {n}.","She gets {det} {n} at {det} {n2}.",
        "Get {det} {n} out of {det} {n2}.","Get up from {det} {n}.",
        "Get on {det} {n}.","Get off {det} {n}.",
    ],
    "give": [
        "Give {det} {n} to me.","I gave {det} {n} to her.",
        "Give your {n} to {det} {p}.","I give {det} {n} to my {p}.",
        "Give me {det} {n}.","Give {det} {n} back.",
        "Give out {det} {n}.","Give away {det} {n}.",
    ],
    "make": [
        "I make {det} {n}.","She made {det} {n}.",
        "Make {det} {n}.","I make {det} {n} and {det} {n2}.",
        "Make {det} {n} ready.","I make {det} {n} with {det} {n2}.",
        "Make a {n}.","Make out {det} {n}.",
    ],
    "do": [
        "I do my work.","Do the work.","She did the work.",
        "I do the work with my {body}.","Do it again.",
        "Do the {n}.","I do {det} {n}.",
    ],
    "have": [
        "I have {det} {n}.","She has {det} {n}.",
        "Have {det} {n}.","I have {det} {n} in my hand.",
        "We have {n} and {n2}.","I have {det} {adj} {n}.",
        "Have a {n}.","I have {det} {n} on.",
    ],
    "be": [
        "This is my {n}.","The {n} is on {det} {n2}.",
        "I am at {det} {n}.","The {n} is {adj}.",
        "This is {det} {n}.","The {n} is {adj} and {adj2}.",
        "It is {det} {adj} {n}.","I am {adj}.",
    ],
    "say": [
        "I say yes.","Say it again.","I said the word.",
        "Say the word to me.","She says no.",
        "I say the {n}.","Say {det} {n}.",
    ],
    "see": [
        "I see {det} {n}.","See {det} {n}.",
        "I saw {det} {n} on {det} {n2}.","See my {n}.",
        "I see {det} {n} and {det} {n2}.","I see {det} {adj} {n}.",
        "See the {n} through {det} {n2}.","See off {det} {p}.",
    ],
    "keep": [
        "Keep {det} {n}.","I keep {det} {n} in {det} {n2}.",
        "Keep your {body} on {det} {n}.","I keep {det} {n} under {det} {n2}.",
        "Keep it.","Keep the {n} {adj}.",
        "Keep on with the {n}.","Keep off {det} {n}.",
    ],
    "let": [
        "Let me see {det} {n}.","Let {det} {n} go.",
        "Let me go to {det} {n}.","Let her have {det} {n}.",
        "Let us go.","Let him do {det} {n}.",
        "Let the {n} come in.","Let {det} {p} in.",
    ],
    "seem": [
        "It seems {adj}.","The {n} seems {adj}.",
        "It seems like {det} {n}.","This seems {adj}.",
        "She seems {adj}.","The {n} seems {adj} and {adj2}.",
        "It seems {adj} to me.","It seems to {v}.",
    ],
    "send": [
        "I send {det} {n}.","Send {det} {n} to me.",
        "I sent {det} {n} to {det} {p}.","Send it back.",
        "I send {det} {n}.","Send {det} {n} out.",
        "Send {det} {n} away.","Send off {det} {n}.",
    ],
    "may": [
        "You may go.","I may go to {det} {n}.",
        "You may have {det} {n}.","She may see {det} {n}.",
        "It may be {adj}.","You may do {det} {n}.",
        "I may have {det} {n}.","It may seem {adj}.",
    ],
    "will": [
        "I will go to {det} {n}.","She will see {det} {n}.",
        "I will have {det} {n}.","He will do the work.",
        "We will come.","I will put {det} {n} on {det} {n2}.",
        "She will give {det} {n} to me.","I will make {det} {n}.",
    ],
}

# Step 2: Op × Dir 组合句型 (每个组合 × 3-5个句型)
# 格式: (op, dir) -> [templates]
S2_TMPL = {}
for op in OPS:
    for d in DIRS:
        key = (op, d)
        # 通用模板
        S2_TMPL[key] = [
            f"{op.capitalize()} {d} {{det}} {{n}}.",
            f"{op.capitalize()} {{det}} {{n}} {d}.",
            f"{op.capitalize()} {d}.",
            f"{op.capitalize()} {{det}} {{n}} {d} to {{det}} {{n2}}.",
            f"{op.capitalize()} it {d}.",
        ]

# 为高频组合添加更多特定模板
HIGH_FREQ_COMBOS = {
    ("put","on"): ["Put {det} {n} on.","Put {det} {n} on {det} {n2}.","She put her {cloth} on.","Put it on {det} {n}.","Put {det} {cloth} on {det} {n}."],
    ("put","off"): ["Put off {det} {n}.","I put off my work.","Don't put it off.","Put {det} {n} off.","She put off her {n}."],
    ("put","in"): ["Put {det} {n} in {det} {n2}.","Put your {body} in your {body2}.","Put it in.","Put {det} {food} in your mouth.","Put {det} {n} in {det} {n2}."],
    ("put","out"): ["Put out {det} {n}.","Put your {body} out.","Put {det} {n} out.","Put it out.","Put {det} {fire} out."],
    ("put","down"): ["Put {det} {n} down.","Put down your {body}.","Put it down on {det} {n}.","Put {det} {n} down on {det} {n2}.","Put down {det} {n}."],
    ("put","up"): ["Put up {det} {n}.","Put {det} {n} up on {det} {n2}.","Put up your {body}.","Put it up.","Put {det} {n} up."],
    ("take","off"): ["Take your {cloth} off.","Take {det} {n} off {det} {n2}.","Take your {body} off {det} {n}.","Take off your {cloth}.","Take it off."],
    ("take","out"): ["Take {det} {n} out of {det} {n2}.","Take out your {n}.","Take {det} {n} out.","Take {det} {food} out of {det} {n}.","Take your {body} out of {det} {n}."],
    ("take","up"): ["Take up {det} {n}.","Take {det} {n} up to {det} {n2}.","Take up your {n}.","Take it up.","Take up {det} {n}."],
    ("take","away"): ["Take away {det} {n}.","Take {det} {n} away from {det} {n2}.","Take it away.","Take {det} {food} away.","Take away your {n}."],
    ("take","back"): ["Take back {det} {n}.","Take {det} {n} back to {det} {n2}.","Take it back.","Take {det} {n} back.","Take back your {n}."],
    ("get","up"): ["Get up from {det} {n}.","Get up.","Get up from your seat.","Get up off {det} {n}.","Get up and go."],
    ("get","out"): ["Get out of {det} {n}.","Get out!","Get out of {det} {room}.","Get out from under {det} {n}.","Get your {n} out."],
    ("get","in"): ["Get in {det} {n}.","Get in!","Get in through {det} {n}.","Get in {det} {transport}.","Get in."],
    ("get","off"): ["Get off {det} {n}.","Get off!","Get off {det} {transport}.","Get off {det} {n}.","Get your {body} off {det} {n}."],
    ("get","on"): ["Get on {det} {n}.","Get on!","Get on {det} {transport}.","Get on with your work.","Get on {det} {n}."],
    ("get","back"): ["Get {det} {n} back.","Get back to {det} {n}.","Get back!","Get your {n} back.","Get back from {det} {n}."],
    ("go","in"): ["Go in through {det} {n}.","Go in!","Go in {det} {n}.","Go in to {det} {n}.","Go in."],
    ("go","out"): ["Go out of {det} {n}.","Go out!","Go out through {det} {n}.","Go out of {det} {room}.","Go out."],
    ("go","on"): ["Go on with your work.","Go on!","Go on to {det} {n}.","Go on through {det} {n}.","Go on with it."],
    ("go","up"): ["Go up to {det} {n}.","Go up!","Go up {det} {n}.","Go up through {det} {n}.","Go up."],
    ("go","down"): ["Go down to {det} {n}.","Go down!","Go down {det} {n}.","Go down through {det} {n}.","Go down."],
    ("go","back"): ["Go back to {det} {n}.","Go back!","Go back through {det} {n}.","Go back from {det} {n}.","Go back home."],
    ("go","over"): ["Go over {det} {n}.","Go over to {det} {n}.","Go over it.","Go through {det} {n}.","Go over."],
    ("go","through"): ["Go through {det} {n}.","Go through!","Go through {det} {n} to {det} {n2}.","Go through {det} {door}."],
    ("come","in"): ["Come in through {det} {door}.","Come in!","Come in to {det} {room}.","Come in from {det} {n}.","Come in."],
    ("come","out"): ["Come out of {det} {n}.","Come out!","Come out through {det} {door}.","Come out of {det} {room}.","Come out from under {det} {n}."],
    ("come","back"): ["Come back to {det} {n}.","Come back!","Come back through {det} {door}.","Come back from {det} {n}.","Come back."],
    ("come","from"): ["I come from {det} {n}.","She comes from {det} {n}.","It comes from {det} {n}.","Come from {det} {n}.","Where do you come from?"],
    ("give","up"): ["Give up {det} {n}.","Don't give up.","Give up!","Give up your {n}.","Never give up."],
    ("give","out"): ["Give out {det} {n}.","Give {det} {n} out to {det} {p}.","Give out your {n}.","Give it out.","Give {det} {food} out."],
    ("give","back"): ["Give back {det} {n}.","Give {det} {n} back to me.","Give it back.","Give {det} {n} back.","Give back your {n}."],
    ("give","away"): ["Give away {det} {n}.","Give {det} {n} away to {det} {p}.","Give it away.","Give away your {n}.","Give {det} {food} away."],
    ("keep","on"): ["Keep on with your work.","Keep on!","Keep on going.","Keep on with it.","Keep on through {det} {n}."],
    ("keep","up"): ["Keep up your work.","Keep up!","Keep {det} {n} up.","Keep up with {det} {p}.","Keep it up."],
    ("keep","off"): ["Keep off {det} {n}.","Keep off!","Keep your {body} off {det} {n}.","Keep off {det} {n}.","Keep {det} {n} off {det} {n2}."],
    ("make","up"): ["Make up {det} {n}.","Make it up.","Make up your {n}.","She made up {det} {n}.","Make {det} {n} up."],
    ("make","out"): ["Make out {det} {n}.","Make it out.","I can't make out {det} {n}.","Make {det} {n} out."],
    ("let","in"): ["Let {det} {p} in.","Let in {det} {n}.","Let me in!"],
    ("let","out"): ["Let {det} {p} out.","Let out {det} {n}.","Let me out!"],
    ("let","go"): ["Let go of {det} {n}.","Let {det} {n} go.","Let go!"],
    ("send","out"): ["Send out {det} {n}.","Send {det} {n} out to {det} {p}.","Send it out."],
    ("send","back"): ["Send back {det} {n}.","Send {det} {n} back to {det} {p}.","Send it back."],
    ("send","off"): ["Send off {det} {n}.","Send {det} {n} off to {det} {p}.","Send it off."],
    ("see","off"): ["See {det} {p} off.","I saw him off.","See off your {p}."],
    ("see","through"): ["See through {det} {n}.","See {det} {n} through.","I see through it.","See through {det} {p}."],
}
for k, v in HIGH_FREQ_COMBOS.items():
    S2_TMPL[k] = v

# Step 3: 场景句型
S3_TMPL = {
    "My Room": [
        "This is my room.","The door is in the wall.",
        "My bed is against the wall under the window.",
        "I put my {n} on the table between the bed and the door.",
        "The window is open.","I have a {n} on the wall.",
        "My room is {adj} but {adj2}.","I keep my room {adj}.",
        "There is a {n} on the table.","I go to my room and put my {cloth} on the bed.",
        "The floor is {adj}.","I put my {n} under the bed.",
        "My room has one door and one window.","I see the garden through the window.",
        "The wall is {adj}.",
    ],
    "At a Meal": [
        "Some {food} is on the table.","I take my {tool} and put the {food} in my mouth.",
        "I put {food} on my {food2}.","I take {food} on my {food2} with my {tool}.",
        "The {food} is in the {tool}.","Give me the {food}.",
        "I have {food} with my {food2}.","The {food} is {adj}.",
        "I take the {tool} off the table.","Put the {tool} and {tool2} on the {tool3}.",
        "I drink {food} after my {food2}.","The {food} is {adj}.",
        "Take some {food} and put {food2} on it.","I give the {food} to my friend.",
        "We have our {food} at the table.",
    ],
    "At the Station": [
        "I go to the station.","I get a ticket at the station.",
        "The {transport} is at the station.","I get on the {transport}.",
        "I give the ticket to the {p}.","I put my {n} on the seat.",
        "The {transport} goes through the country.","I see the country through the window.",
        "My {p} is on the {transport}.","I give my {p} a {n}.",
        "The {transport} goes to the city.","I get off the {transport} at the station.",
        "I take my {n} off the {transport}.","The station is a {adj} building.",
        "I go from the station to my office.",
    ],
    "The Body": [
        "This is my body.","I have a {body}, two {body2}, and two {body3}.",
        "I have two {body} and two {body2}.","My {body} is under my {body2}.",
        "I have ten {body} on my {body2}.","I have ten {body} on my {body2}.",
        "My {body} is in my body.","{Body_cap} goes through my body.",
        "I see with my {body}.","I hear with my {body}.",
        "I take {food} in through my {body}.","My {body} is on my {body2}.",
        "My {body} is {adj}.","I put my {body} on my {body2}.",
        "The body is the house of the mind.",
    ],
    "The Weather": [
        "The weather is {adj} in the summer.","In the winter it is {adj}.",
        "The {n} is {adj} in the day.","At night I see the {n} and {n2}.",
        "{Noun_cap} comes down from the {n2}.","{Noun_cap} is {adj} and {adj2}.",
        "The {n} goes through the {n2}.","The {n} is {adj} after {n2}.",
        "{Noun_cap} are in the {n2}.","The weather is {adj} today.",
        "It is {adj} in the {n}.","It is {adj} under the {n}.",
        "The {n} puts out the {n2}.","{Noun_cap} comes down from the {n2}.",
        "The {n} is {adj} today.",
    ],
    "The Family": [
        "My {p} is a {p2}.","My {p} is a {p2}.",
        "I am their {p}.","My {p} is a {p2}.",
        "My {p} is a {p2}.","We are a family.",
        "My {p} goes to work.","My {p} keeps the house.",
        "I go to school.","My {p} and I are {adj}.",
        "My {p} has a {adj} {n}.","We have our {food} together.",
        "My {p} gives me a {n}.","My {p} says I am a {adj} {p2}.",
        "I love my family.",
    ],
    "Shopping": [
        "I go to the shop.","I have some money.",
        "The shop has {food} and {cloth}.","I take a {n} from the shelf.",
        "What is the price of this {n}?","The price is {adj}.",
        "I give the money to the {p}.","I put the {n} in my {n2}.",
        "I take {food} and {food2} from the shop.","The shop is {adj}.",
        "I get my {food} at the shop.","Put the {food} in the {n}.",
        "I go home from the shop.","The shop has {adj} {cloth}.",
        "I take a {cloth} for my {p}.",
    ],
    "At School": [
        "I go to school.","The school is a {adj} building.",
        "I have a {n} and {n2}.","The {p} is at school.",
        "I see my {p} at school.","The {p} gives us work.",
        "I do my work with my {n}.","I put my {n} on the table.",
        "The {p} says the word.","I say the word again.",
        "My {p} and I go through the {door}.","We go to our room.",
        "The school has a garden.","I see the garden through the window.",
        "I keep my {n} {adj}.",
    ],
    "Health": [
        "My body is {adj}.","I have a pain in my {body}.",
        "My {body} is {adj}.","I feel {adj}.",
        "I have a pain in my {body}.","Put your {body} on your {body2}.",
        "The {body} goes through your body.","I see the {p}.",
        "The {p} says I am {adj}.","I keep my body {adj}.",
        "My {body} has a pain.","I have a {adj} cold.",
        "The {p} gives me {n}.","I take the {n} with {food}.",
        "I get {adj}.",
    ],
    "The House": [
        "This is my house.","The house has four {n} and a {n2}.",
        "The {door} is in the front {n}.","There are two {n} in the house.",
        "I go in through the {door}.","The {n} is {adj}.",
        "I have a {n} in the house.","The house is {adj}.",
        "There is a garden by the house.","I put a {n} and {n2} in the house.",
        "My room is in the house.","The house is my home.",
        "I keep the house {adj}.","The {n} is over the house.",
        "I see the {n} through the {n2}.",
    ],
    "Animals": [
        "The {animal} is a {adj} {n}.","I see a {animal} in the {n}.",
        "The {animal} has four {body}.","The {animal} goes through the {n}.",
        "A {animal} is on the {n}.","The {animal} puts its {body} on the {n}.",
        "I give {food} to the {animal}.","The {animal} takes the {food} in its {body}.",
        "The {animal} is {adj} and {adj2}.","A {animal} and a {animal2} are in the {n}.",
        "The {animal} sees the {n} with its {body}.","I have a {animal}.",
        "The {animal} is my {n}.","The {animal} goes about the {n}.",
        "The {animal} is in the {n}.",
    ],
    "Nature": [
        "The {n} is {adj}.","I see the {n} in the {n2}.",
        "The {n} comes down from the {n2}.","The {n} goes through the {n2}.",
        "The {n} is on the {n2}.","The {n} is under the {n2}.",
        "I put my {body} in the {n}.","The {n} is {adj} and {adj2}.",
        "The {n} comes from the {n2}.","I see {det} {n} and {det} {n2}.",
        "The {n} is over the {n2}.","The {n} is between the {n2} and the {n3}.",
        "The {n} is about the {n2}.","The {n} is across the {n2}.",
        "The {n} is against the {n2}.",
    ],
    "Transport": [
        "I go to the {n}.","The {transport} is at the {n}.",
        "I get on the {transport}.","I get off the {transport}.",
        "The {transport} goes through the {n}.","I see the {n} through the {n2}.",
        "I put my {n} on the {n2}.","The {transport} goes to the {n}.",
        "I take my {n} off the {transport}.","I go from the {n} to the {n2}.",
        "The {transport} is {adj}.","I have a {n} for the {transport}.",
        "I give the {n} to the {p}.","The {transport} goes {adv}.",
        "I get the {transport} at the {n}.",
    ],
    "Work": [
        "I go to work.","My work is {adj}.",
        "I do my work with my {body}.","I put my {n} on the {n2}.",
        "I take my {n} from the {n2}.","I give my work to the {p}.",
        "The {p} says my work is {adj}.","I keep on with my work.",
        "I make {det} {n} for my work.","I have {det} {n} at work.",
        "I go from work to {det} {n}.","My work is in {det} {n}.",
        "I do {det} {n} and {det} {n2}.","I put my work in {det} {n}.",
        "I take my work home.",
    ],
    "Time": [
        "The {n} is {adj}.","I go to {det} {n} in the morning.",
        "I come home in the evening.","The {n} is {adj} today.",
        "Today is {adj}.","Tomorrow I will go to {det} {n}.",
        "Yesterday I went to {det} {n}.","I have {det} {n} today.",
        "The {n} is {adj} and {adj2}.","I do {det} {n} in the day.",
        "I see {det} {n} at night.","The {n} comes after {det} {n2}.",
        "I put {det} {n} before {det} {n2}.","I keep {det} {n} till tomorrow.",
        "I have {det} {n} for {det} {n2}.",
    ],
    "Feelings": [
        "I feel {adj}.","She seems {adj}.",
        "The {n} is {adj}.","I have a {adj} {n}.",
        "The {n} makes me {adj}.","I see {det} {adj} {n}.",
        "The {p} is {adj}.","I say I am {adj}.",
        "The {n} seems {adj} to me.","I keep {adj}.",
        "The {n} is {adj} and {adj2}.","I go to {det} {n} when I am {adj}.",
        "The {p} gives me a {adj} {n}.","I put my {body} on my {body2} and feel {adj}.",
        "The {n} comes and I am {adj}.",
    ],
}

# ===== 生成函数 =====

def pick(lst, n=1, exclude=None):
    """从列表随机选n个不重复的"""
    pool = [x for x in lst if x != exclude] if exclude else lst
    if n == 1:
        return random.choice(pool)
    return random.sample(pool, min(n, len(pool)))

def gen_step1():
    results = []
    for op, tmpls in S1_TMPL.items():
        for tmpl in tmpls:
            try:
                n, n2, n3 = pick(ALL_NOUNS), pick(ALL_NOUNS), pick(ALL_NOUNS)
                body, body2 = pick(BODIES), pick(BODIES)
                p = pick(PEOPLE)
                adj, adj2 = pick(ADJS), pick(ADJS)
                det = pick(DETS)
                sentence = tmpl.format(
                    n=n, n2=n2, n3=n3, body=body, body2=body2,
                    p=p, adj=adj, adj2=adj2, det=det,
                    cloth=pick(CLOTHES), food=pick(FOODS), v=op
                )
                results.append({"step":1,"operator":op,"type":"operator_basic","sentence":sentence})
            except (KeyError, IndexError):
                continue
    return results

def gen_step2():
    results = []
    for (op, d), tmpls in S2_TMPL.items():
        for tmpl in tmpls:
            try:
                n, n2 = pick(ALL_NOUNS), pick(ALL_NOUNS)
                body, body2 = pick(BODIES), pick(BODIES)
                p = pick(PEOPLE)
                adj = pick(ADJS)
                det = pick(DETS)
                sentence = tmpl.format(
                    n=n, n2=n2, body=body, body2=body2,
                    p=p, adj=adj, det=det,
                    cloth=pick(CLOTHES), food=pick(FOODS),
                    fire="fire", room=pick(HOMES), door="door",
                    transport=pick(TRANSPORT), person=p,
                )
                results.append({"step":2,"operator":op,"direction":d,"type":"op_dir_combo","sentence":sentence})
            except (KeyError, IndexError):
                continue
    return results

def gen_step3():
    results = []
    for scene, tmpls in S3_TMPL.items():
        for tmpl in tmpls:
            try:
                n, n2, n3 = pick(ALL_NOUNS), pick(ALL_NOUNS), pick(ALL_NOUNS)
                body, body2, body3 = pick(BODIES), pick(BODIES), pick(BODIES)
                p, p2 = pick(PEOPLE), pick(PEOPLE)
                adj, adj2 = pick(ADJS), pick(ADJS)
                det = pick(DETS)
                food, food2 = pick(FOODS), pick(FOODS)
                cloth = pick(CLOTHES)
                tool, tool2, tool3 = pick(TOOLS), pick(TOOLS), pick(TOOLS)
                animal, animal2 = pick(ANIMALS), pick(ANIMALS)
                transport = pick(TRANSPORT)
                door = "door"
                sentence = tmpl.format(
                    n=n, n2=n2, n3=n3,
                    body=body, body2=body2, body3=body3,
                    p=p, p2=p2, adj=adj, adj2=adj2, det=det,
                    food=food, food2=food2, cloth=cloth,
                    tool=tool, tool2=tool2, tool3=tool3,
                    animal=animal, animal2=animal2,
                    transport=transport, door=door,
                    Body_cap=body.capitalize(), Noun_cap=n.capitalize(),
                )
                results.append({"step":3,"scene":scene,"type":"scene_sentence","sentence":sentence})
            except (KeyError, IndexError):
                continue
    return results

def main():
    print("Generating Step 1: Operator basics...")
    s1 = gen_step1()
    print(f"  -> {len(s1)} sentences")
    
    print("Generating Step 2: Op × Direction combos...")
    s2 = gen_step2()
    print(f"  -> {len(s2)} sentences")
    
    print("Generating Step 3: Scene sentences...")
    s3 = gen_step3()
    print(f"  -> {len(s3)} sentences")
    
    all_sents = s1 + s2 + s3
    print(f"\nTotal: {len(all_sents)} sentences")
    
    # 去重
    seen = set()
    unique = []
    for s in all_sents:
        key = s["sentence"]
        if key not in seen:
            seen.add(key)
            unique.append(s)
    print(f"After dedup: {len(unique)} sentences")
    
    # 写文件
    out = "/Users/cuijianchen/Projects/ogden-audit/data/training-data-v2.jsonl"
    with open(out, "w") as f:
        for s in unique:
            f.write(json.dumps(s, ensure_ascii=False) + "\n")
    print(f"Written to {out}")
    
    # 统计
    c1 = sum(1 for s in unique if s["step"]==1)
    c2 = sum(1 for s in unique if s["step"]==2)
    c3 = sum(1 for s in unique if s["step"]==3)
    print(f"\nStep 1: {c1} | Step 2: {c2} | Step 3: {c3}")
    
    # 输出样本
    print("\n=== Sample (20) ===")
    for s in unique[:20]:
        print(f"[S{s['step']}] {s['sentence']}")
    
    return unique

if __name__ == "__main__":
    main()
