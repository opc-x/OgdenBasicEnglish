#!/usr/bin/env python3
"""
Ogden BE850 Training Data Generator
三步走排列组合批量生成训练句子
Step 1: 18 Operator 基础句 (~144句)
Step 2: Operator × 方向 组合句 (~360句)
Step 3: 场景句子 (~150句)
"""

import json

# === 数据定义 ===

OPERATORS = [
    "come", "get", "give", "go", "keep", "let", "make", "put",
    "seem", "take", "be", "do", "have", "say", "see", "send"
]

# 18 operator 全部（含 may/will 但主要用于造句的是上面16个动作operator）
ALL_OPERATORS = OPERATORS + ["may", "will"]

DIRECTIONS = [
    "in", "out", "on", "off", "up", "down", "back",
    "over", "about", "through", "across", "after", "away",
    "to", "from", "at", "between", "under", "with"
]

# 从 850 词表提取的常用名词（THINGS 可画图类 + 部分一般物）
CONCRETE_NOUNS = [
    # 家居
    "book", "table", "bed", "door", "window", "room", "house", "wall",
    "chair", "floor", "roof", "box", "shelf", "drawer", "clock", "picture",
    "light", "fire", "key", "lock", "letter", "paper", "pen", "pencil",
    # 身体
    "head", "hand", "foot", "eye", "ear", "mouth", "nose", "face",
    "arm", "leg", "heart", "blood", "hair", "skin", "bone", "tooth",
    # 衣物
    "coat", "hat", "shirt", "shoe", "dress", "cloth", "button", "collar",
    # 食物
    "food", "bread", "meat", "milk", "water", "butter", "salt", "sugar",
    "soup", "potato", "egg", "fish", "fruit", "cake", "cheese", "drink",
    # 交通
    "train", "bus", "boat", "ship", "car", "horse", "road", "street",
    "bridge", "station", "wheel",
    # 自然
    "sun", "moon", "star", "sky", "air", "water", "rain", "snow",
    "wind", "cloud", "mountain", "river", "sea", "tree", "flower", "leaf",
    "grass", "root", "seed", "stone",
    # 动物
    "dog", "cat", "bird", "fish", "horse", "cow", "sheep", "pig",
    # 场所
    "school", "church", "office", "store", "shop", "farm", "garden",
    "library", "hospital", "prison",
    # 人
    "man", "woman", "boy", "girl", "child", "baby", "friend",
    "father", "mother", "son", "daughter", "brother", "sister",
    # 工具
    "knife", "fork", "spoon", "plate", "cup", "pot", "bottle", "bag",
    "brush", "comb", "needle", "thread", "string", "rope",
    # 抽象但高频
    "work", "name", "number", "time", "day", "night", "year", "morning",
    "end", "line", "point", "side", "top", "bottom", "back", "front",
    "part", "place", "way", "thing"
]

# 品质词（BE850 形容词）
QUALITIES = [
    "good", "great", "new", "old", "young", "long", "short", "high", "low",
    "big", "small", "large", "little", "wide", "narrow", "thick", "thin",
    "deep", "flat", "round", "sharp", "smooth", "rough", "hard", "soft",
    "heavy", "full", "empty", "open", "shut", "clean", "dry", "wet",
    "hot", "cold", "warm", "cool", "light", "dark", "bright", "clear",
    "strong", "weak", "quick", "slow", "fast", "early", "late", "near", "far",
    "red", "blue", "green", "black", "white", "brown", "yellow", "grey",
    "happy", "sad", "angry", "afraid", "safe", "dangerous", "alive", "dead",
    "true", "false", "right", "wrong", "same", "different", "special",
    "free", "ready", "simple", "complex", "important", "necessary", "possible",
    "public", "private", "common", "natural", "physical", "mental",
    "sweet", "sour", "bitter", "salt", "loud", "quiet", "soft", "tired"
]

# Step 2: operator × 方向 有效组合（基于 phrasal-verbs.md 扩展）
OP_DIRECTION_COMBOS = [
    # put 组合
    ("put", "on", "穿上/放上"),
    ("put", "off", "推迟"),
    ("put", "in", "放入"),
    ("put", "out", "熄灭"),
    ("put", "down", "放下/写下"),
    ("put", "up", "举起/提供住宿"),
    ("put", "away", "收好"),
    ("put", "through", "穿过/完成"),
    ("put", "together", "组装"),
    # take 组合
    ("take", "off", "脱下/起飞"),
    ("take", "out", "拿出"),
    ("take", "in", "吸收/欺骗"),
    ("take", "up", "开始学/占据"),
    ("take", "away", "拿走"),
    ("take", "back", "收回/退回"),
    ("take", "over", "接管"),
    ("take", "down", "拿下来/记下"),
    # get 组合
    ("get", "up", "起来/起床"),
    ("get", "out", "出去/逃脱"),
    ("get", "in", "进来/进入"),
    ("get", "off", "下车/离开"),
    ("get", "on", "上车/进展"),
    ("get", "back", "回来/取回"),
    ("get", "over", "克服/越过"),
    ("get", "through", "度过/完成"),
    # go 组合
    ("go", "in", "进去"),
    ("go", "out", "出去"),
    ("go", "on", "继续/发生"),
    ("go", "up", "上去"),
    ("go", "down", "下去"),
    ("go", "back", "回去"),
    ("go", "over", "越过/检查"),
    ("go", "through", "经历/检查"),
    ("go", "off", "离开/响"),
    ("go", "after", "追求/追逐"),
    # come 组合
    ("come", "in", "进来"),
    ("come", "out", "出来/出现"),
    ("come", "back", "回来"),
    ("come", "on", "开始/快点"),
    ("come", "up", "上来/出现"),
    ("come", "down", "下来"),
    ("come", "from", "来自"),
    # give 组合
    ("give", "up", "放弃"),
    ("give", "out", "分发"),
    ("give", "back", "归还"),
    ("give", "in", "屈服"),
    ("give", "away", "赠送/泄露"),
    # make 组合
    ("make", "up", "编造/和好"),
    ("make", "out", "看清/搞清"),
    # keep 组合
    ("keep", "on", "坚持"),
    ("keep", "off", "避开"),
    ("keep", "up", "保持"),
    ("keep", "out", "留在外面"),
    ("keep", "back", "阻挡"),
    # let 组合
    ("let", "in", "放进来"),
    ("let", "out", "放出去"),
    ("let", "go", "放手/松开"),
    # send 组合
    ("send", "out", "发出"),
    ("send", "back", "退回"),
    ("send", "off", "寄出/送走"),
    ("send", "away", "送走"),
    # see 组合
    ("see", "off", "送行"),
    ("see", "through", "看穿/坚持"),
    # do 组合
    ("do", "away", "去掉/废除"),
    ("do", "without", "没有...也行"),
    # have 组合
    ("have", "on", "穿着"),
]

# 场景定义 (Step 3)
SCENARIOS = {
    "My Room": {
        "objects": ["bed", "table", "chair", "door", "window", "wall", "shelf", "lamp", "box", "book", "picture"],
        "actions": ["put", "take", "get", "be"],
    },
    "At a Meal": {
        "objects": ["food", "bread", "meat", "water", "milk", "soup", "spoon", "knife", "fork", "plate", "cup", "table"],
        "actions": ["put", "take", "get", "give", "eat", "drink"],
    },
    "At the Station": {
        "objects": ["train", "ticket", "station", "platform", "bag", "pocket", "friend", "door", "window", "seat"],
        "actions": ["go", "get", "take", "put", "give"],
    },
    "The Body": {
        "objects": ["head", "eye", "ear", "mouth", "nose", "hand", "foot", "arm", "leg", "heart", "blood", "skin", "hair"],
        "actions": ["have", "put", "take", "see", "keep"],
    },
    "The Weather": {
        "objects": ["sun", "rain", "snow", "wind", "cloud", "air", "weather", "day", "night", "water", "sky"],
        "actions": ["be", "come", "go", "get", "see"],
    },
    "The Family": {
        "objects": ["father", "mother", "son", "daughter", "brother", "sister", "friend", "baby", "child", "man", "woman"],
        "actions": ["be", "have", "come", "go", "give", "see"],
    },
    "Shopping": {
        "objects": ["shop", "store", "money", "price", "box", "bag", "book", "shirt", "dress", "food", "bread", "meat"],
        "actions": ["give", "get", "take", "put", "be"],
    },
    "At School": {
        "objects": ["school", "book", "pen", "paper", "teacher", "friend", "door", "window", "room", "table", "seat"],
        "actions": ["go", "come", "put", "take", "get", "give", "see", "do"],
    },
    "Health": {
        "objects": ["head", "heart", "blood", "skin", "bone", "eye", "mouth", "hand", "foot", "body", "bed"],
        "actions": ["have", "put", "take", "see", "get", "feel"],
    },
    "The House": {
        "objects": ["house", "door", "window", "wall", "floor", "roof", "room", "garden", "table", "bed", "chair", "fire"],
        "actions": ["be", "have", "go", "come", "put", "take"],
    },
}

# === 生成函数 ===

def generate_step1():
    """Step 1: Operator 基础句 - 每个 operator 造多个基础句"""
    sentences = []
    
    # 为每个 operator 创建基础句型模板
    templates = {
        "put": [
            "I put the {obj1} on the {obj2}.",
            "She put the {obj1} in the {obj2}.",
            "Put your {body} on your {body2}.",
            "I put the {obj1} under the {obj2}.",
            "He put the {obj1} by the {obj2}.",
        ],
        "take": [
            "I take the {obj1} off the {obj2}.",
            "Take your {body} off your {body2}.",
            "I take the {obj1} from the {obj2}.",
            "Take the {obj1} to the {obj2}.",
            "She took the {obj1} out of the {obj2}.",
        ],
        "go": [
            "I go to the {obj1}.",
            "Go to your {obj1}.",
            "I go from the {obj1} to the {obj2}.",
            "She goes to the {obj1}.",
            "We go through the {obj1}.",
        ],
        "come": [
            "Come to the {obj1}.",
            "She came to the {obj1}.",
            "Come from the {obj1}.",
            "I come to the {obj1}.",
            "Come through the {obj1}.",
        ],
        "get": [
            "I get the {obj1} from the {obj2}.",
            "Get your {obj1} from the {obj2}.",
            "I get a {obj1}.",
            "She gets the {obj1} at the {obj2}.",
            "Get the {obj1} out of the {obj2}.",
        ],
        "give": [
            "Give the {obj1} to me.",
            "I gave the {obj1} to her.",
            "Give your {obj1} to the {person}.",
            "I give the {obj1} to my {person}.",
            "Give me the {obj1}.",
        ],
        "make": [
            "I make a {obj1}.",
            "She made the {obj1}.",
            "Make a {obj1}.",
            "I make {obj1} and {obj2}.",
            "Make the {obj1} ready.",
        ],
        "do": [
            "I do my work.",
            "Do the work.",
            "She did the work.",
            "I do the work with my {body}.",
            "Do it again.",
        ],
        "have": [
            "I have a {obj1}.",
            "She has a {obj1}.",
            "Have a {obj1}.",
            "I have the {obj1} in my hand.",
            "We have {obj1} and {obj2}.",
        ],
        "be": [
            "This is my {obj1}.",
            "The {obj1} is on the {obj2}.",
            "I am at the {obj1}.",
            "The {obj1} is good.",
            "This is a {obj1}.",
        ],
        "say": [
            "I say yes.",
            "Say it again.",
            "I said the word.",
            "Say the word to me.",
            "She says no.",
        ],
        "see": [
            "I see the {obj1}.",
            "See the {obj1}.",
            "I saw the {obj1} on the {obj2}.",
            "See my {obj1}.",
            "I see a {obj1} and a {obj2}.",
        ],
        "keep": [
            "Keep the {obj1}.",
            "I keep the {obj1} in the {obj2}.",
            "Keep your {body} on the {obj1}.",
            "I keep the {obj1} under the {obj2}.",
            "Keep it.",
        ],
        "let": [
            "Let me see the {obj1}.",
            "Let the {obj1} go.",
            "Let me go to the {obj1}.",
            "Let her have the {obj1}.",
            "Let us go.",
        ],
        "seem": [
            "It seems good.",
            "The {obj1} seems new.",
            "It seems like a {obj1}.",
            "This seems important.",
            "She seems happy.",
        ],
        "send": [
            "I send the {obj1}.",
            "Send the {obj1} to me.",
            "I sent the {obj1} to the {person}.",
            "Send it back.",
            "I send a {obj1}.",
        ],
        "may": [
            "You may go.",
            "I may go to the {obj1}.",
            "You may have the {obj1}.",
            "She may see the {obj1}.",
            "It may be good.",
        ],
        "will": [
            "I will go to the {obj1}.",
            "She will see the {obj1}.",
            "I will have the {obj1}.",
            "He will do the work.",
            "We will come.",
        ],
    }
    
    obj_pool = ["book", "table", "bed", "door", "window", "box", "food", "water", "coat", "hand", "head", "room", "letter", "picture", "knife", "plate", "cup"]
    body_pool = ["hand", "foot", "head", "arm", "leg", "eye", "ear", "mouth", "nose"]
    person_pool = ["friend", "father", "mother", "brother", "sister", "teacher"]
    
    for op in ALL_OPERATORS:
        if op not in templates:
            continue
        for tpl in templates[op]:
            import random
            random.seed(hash(tpl + op))  # 确定性随机器
            
            try:
                sentence = tpl.format(
                    obj1=random.choice(obj_pool),
                    obj2=random.choice(obj_pool),
                    body=random.choice(body_pool),
                    body2=random.choice(body_pool),
                    person=random.choice(person_pool),
                )
            except KeyError:
                continue
            
            sentences.append({
                "step": 1,
                "operator": op,
                "type": "operator_basic",
                "sentence": sentence
            })
    
    return sentences


def generate_step2():
    """Step 2: Operator × 方向 组合句"""
    sentences = []
    
    # 为每个组合创建模板
    combo_templates = {
        # put 组合
        ("put", "on"): [
            "Put your {obj1} on.",
            "Put the {obj1} on the {obj2}.",
            "She put her {cloth} on.",
            "Put it on the {obj2}.",
            "Put the cloth on the {obj2}.",
        ],
        ("put", "off"): [
            "Put off the {event}.",
            "I put off my work.",
            "Don't put it off.",
            "Put the meeting off.",
            "She put off her {obj1}.",
        ],
        ("put", "in"): [
            "Put the {obj1} in the {obj2}.",
            "Put your {body1} in your {body2}.",
            "Put it in.",
            "Put the food in your mouth.",
            "Put the letter in the box.",
        ],
        ("put", "out"): [
            "Put out the {light}.",
            "Put your hand out.",
            "Put the fire out.",
            "Put it out.",
            "Put your {body} out.",
        ],
        ("put", "down"): [
            "Put the {obj1} down.",
            "Put down your {body}.",
            "Put it down on the {obj2}.",
            "Put the book down.",
            "Put down the {obj1}.",
        ],
        # take 组合
        ("take", "off"): [
            "Take your {cloth} off.",
            "Take the {obj1} off the {obj2}.",
            "Take your {body} off the {obj1}.",
            "Take off your {cloth}.",
            "Take it off.",
        ],
        ("take", "out"): [
            "Take the {obj1} out of the {obj2}.",
            "Take out your {obj1}.",
            "Take a {obj1} out.",
            "Take the food out of the pot.",
            "Take your hand out of the box.",
        ],
        ("take", "up"): [
            "Take up the work.",
            "Take the {obj1} up to the {obj2}.",
            "Take up your {obj1}.",
            "Take it up.",
            "Take up the book.",
        ],
        ("take", "away"): [
            "Take away the {obj1}.",
            "Take the {obj1} away from the {obj2}.",
            "Take it away.",
            "Take the plate away.",
            "Take away your {obj1}.",
        ],
        ("take", "back"): [
            "Take back the {obj1}.",
            "Take it back to the {obj2}.",
            "Take the {obj1} back.",
            "Take back your {obj1}.",
            "Take the book back to the library.",
        ],
        # get 组合
        ("get", "up"): [
            "Get up from the {obj1}.",
            "Get up.",
            "Get up from your seat.",
            "Get up off the {obj1}.",
            "Get up and go.",
        ],
        ("get", "out"): [
            "Get out of the {obj1}.",
            "Get out!",
            "Get out of the room.",
            "Get out from under the {obj1}.",
            "Get your {obj1} out.",
        ],
        ("get", "in"): [
            "Get in the {obj1}.",
            "Get in!",
            "Get in through the {obj1}.",
            "Get in the box.",
            "Get in the train.",
        ],
        ("get", "off"): [
            "Get off the {obj1}.",
            "Get off!",
            "Get off the train.",
            "Get off the table.",
            "Get your {body} off the {obj1}.",
        ],
        ("get", "on"): [
            "Get on the {obj1}.",
            "Get on!",
            "Get on the train.",
            "Get on with your work.",
            "Get on the bus.",
        ],
        ("get", "back"): [
            "Get the {obj1} back.",
            "Get back to the {obj1}.",
            "Get back!",
            "Get your {obj1} back.",
            "Get back from the {obj1}.",
        ],
        # go 组合
        ("go", "in"): [
            "Go in through the {door}.",
            "Go in!",
            "Go in the {obj1}.",
            "Go in to the {obj1}.",
            "Go in.",
        ],
        ("go", "out"): [
            "Go out of the {obj1}.",
            "Go out!",
            "Go out through the {door}.",
            "Go out of the room.",
            "Go out.",
        ],
        ("go", "on"): [
            "Go on with your work.",
            "Go on!",
            "Go on to the {obj1}.",
            "Go on through the {door}.",
            "Go on with it.",
        ],
        ("go", "up"): [
            "Go up to the {obj1}.",
            "Go up!",
            "Go up the {obj1}.",
            "Go up through the {obj1}.",
            "Go up.",
        ],
        ("go", "down"): [
            "Go down to the {obj1}.",
            "Go down!",
            "Go down the {obj1}.",
            "Go down through the {obj1}.",
            "Go down.",
        ],
        ("go", "back"): [
            "Go back to the {obj1}.",
            "Go back!",
            "Go back through the {door}.",
            "Go back from the {obj1}.",
            "Go back home.",
        ],
        ("go", "over"): [
            "Go over the {obj1}.",
            "Go over to the {obj1}.",
            "Go over it.",
            "Go through the {obj1}.",
            "Go over.",
        ],
        # come 组合
        ("come", "in"): [
            "Come in through the {door}.",
            "Come in!",
            "Come in to the {obj1}.",
            "Come in from the {obj1}.",
            "Come in.",
        ],
        ("come", "out"): [
            "Come out of the {obj1}.",
            "Come out!",
            "Come out through the {door}.",
            "Come out of the room.",
            "Come out from under the {obj1}.",
        ],
        ("come", "back"): [
            "Come back to the {obj1}.",
            "Come back!",
            "Come back through the {door}.",
            "Come back from the {obj1}.",
            "Come back.",
        ],
        ("come", "from"): [
            "I come from the {obj1}.",
            "She comes from the {obj1}.",
            "It comes from the {obj1}.",
            "Come from the {obj1}.",
            "Where do you come from?",
        ],
        # give 组合
        ("give", "up"): [
            "Give up the {obj1}.",
            "Don't give up.",
            "Give up!",
            "Give up your {obj1}.",
            "Never give up.",
        ],
        ("give", "out"): [
            "Give out the {obj1}.",
            "Give the {obj1} out to the {person}.",
            "Give out your {obj1}.",
            "Give it out.",
            "Give the food out.",
        ],
        ("give", "back"): [
            "Give back the {obj1}.",
            "Give the {obj1} back to me.",
            "Give it back.",
            "Give the book back.",
            "Give back your {obj1}.",
        ],
        ("give", "away"): [
            "Give away the {obj1}.",
            "Give the {obj1} away to the {person}.",
            "Give it away.",
            "Give away your {obj1}.",
            "Give the food away.",
        ],
        # keep 组合
        ("keep", "on"): [
            "Keep on with your work.",
            "Keep on!",
            "Keep on going.",
            "Keep on with it.",
            "Keep on through the {obj1}.",
        ],
        ("keep", "up"): [
            "Keep up your work.",
            "Keep up!",
            "Keep the {obj1} up.",
            "Keep up with the {person}.",
            "Keep it up.",
        ],
        ("keep", "off"): [
            "Keep off the {obj1}.",
            "Keep off!",
            "Keep your {body} off the {obj1}.",
            "Keep off the table.",
            "Keep the {obj1} off the {obj2}.",
        ],
    }
    
    obj_pool = ["book", "table", "bed", "door", "window", "box", "food", "water", "coat", "hand", "head", "room", "letter", "picture", "knife", "plate", "cup", "train", "bus", "work", "fire", "light"]
    cloth_pool = ["coat", "hat", "shirt", "dress", "shoe"]
    body_pool = ["hand", "foot", "head", "arm", "leg", "eye", "ear"]
    person_pool = ["friend", "father", "mother", "brother", "sister", "teacher"]
    door_pool = ["door", "window"]
    light_pool = ["fire", "light"]
    event_pool = ["meeting", "work", "fight", "attempt"]
    
    for op, direction, meaning in OP_DIRECTION_COMBOS:
        key = (op, direction)
        if key not in combo_templates:
            # 通用模板（用 %s 替换方向词，避免花括号冲突)
            templates = [
                f"{op.capitalize()} {direction} the {{obj1}}.",
                f"{op.capitalize()} the {{obj1}} {direction}.",
                f"{op.capitalize()} {direction}.",
                f"{op.capitalize()} the {{obj1}} {direction} to the {{obj2}}.",
                f"{op.capitalize()} it {direction}.",
            ]
        else:
            templates = combo_templates[key]
        
        for tpl in templates:
            import random
            random.seed(hash(tpl + op + direction))
            
            # 用 safe_format 避免 KeyError
            try:
                sentence = tpl.format(
                    obj1=random.choice(obj_pool),
                    obj2=random.choice(obj_pool),
                    cloth=random.choice(cloth_pool),
                    body=random.choice(body_pool),
                    body1=random.choice(body_pool),
                    body2=random.choice(body_pool),
                    person=random.choice(person_pool),
                    door=random.choice(door_pool),
                    light=random.choice(light_pool),
                    event=random.choice(event_pool),
                )
            except KeyError:
                # 跳过有问题的模板
                continue
            
            sentences.append({
                "step": 2,
                "operator": op,
                "direction": direction,
                "type": "op_direction_combo",
                "meaning": meaning,
                "sentence": sentence
            })
    
    return sentences


def generate_step3():
    """Step 3: 场景句子 - 围绕850词组织场景段落"""
    sentences = []
    
    # 预定义场景句子（确保质量和BE850合规）
    scene_sentences = {
        "My Room": [
            "This is my room.",
            "The door is in the wall.",
            "My bed is against the wall under the window.",
            "I put my books on the table between the bed and the door.",
            "The window is open.",
            "I have a picture on the wall.",
            "My room is small but clean.",
            "I keep my room clean.",
            "There is a light on the table.",
            "I go to my room and put my coat on the bed.",
            "The floor is clean.",
            "I put my shoes under the bed.",
            "My room has one door and one window.",
            "I see the garden through the window.",
            "The wall is white.",
        ],
        "At a Meal": [
            "Some food is on the table.",
            "I take my spoon and put the soup in my mouth.",
            "I put salt on my meat.",
            "I take butter on my bread with my knife.",
            "The water is in the cup.",
            "Give me the bread.",
            "I have milk with my food.",
            "The food is good.",
            "I take the plate off the table.",
            "Put the knife and fork on the plate.",
            "I drink water after my food.",
            "The soup is hot.",
            "Take some bread and put butter on it.",
            "I give the salt to my friend.",
            "We have our food at the table.",
        ],
        "At the Station": [
            "I go to the station.",
            "I get a ticket at the station.",
            "The train is at the station.",
            "I get on the train.",
            "I give the ticket to the man.",
            "I put my bag on the seat.",
            "The train goes through the country.",
            "I see the country through the window.",
            "My friend is on the train.",
            "I give my friend a book.",
            "The train goes to the city.",
            "I get off the train at the station.",
            "I take my bag off the train.",
            "The station is a great building.",
            "I go from the station to my office.",
        ],
        "The Body": [
            "This is my body.",
            "I have a head, two arms, and two legs.",
            "I have two eyes and two ears.",
            "My mouth is under my nose.",
            "I have ten fingers on my hands.",
            "I have ten toes on my feet.",
            "My heart is in my body.",
            "Blood goes through my body.",
            "I see with my eyes.",
            "I hear with my ears.",
            "I take food in through my mouth.",
            "My hair is on my head.",
            "My skin is clean.",
            "I put my hand on my heart.",
            "The body is the house of the mind.",
        ],
        "The Weather": [
            "The weather is warm in the summer.",
            "In the winter it is cold.",
            "The sun is bright in the day.",
            "At night I see the moon and stars.",
            "Rain comes down from the clouds.",
            "Snow is white and cold.",
            "The wind goes through the trees.",
            "The air is clean after rain.",
            "Clouds are in the sky.",
            "The weather is good today.",
            "It is hot in the sun.",
            "It is cool under the tree.",
            "The rain puts out the fire.",
            "Snow comes down from the sky.",
            "The wind is strong today.",
        ],
        "The Family": [
            "My father is a man.",
            "My mother is a woman.",
            "I am their son.",
            "My brother is a boy.",
            "My sister is a girl.",
            "We are a family.",
            "My father goes to work.",
            "My mother keeps the house.",
            "I go to school.",
            "My brother and I are friends.",
            "My sister has a new dress.",
            "We have our food together.",
            "My father gives me a book.",
            "My mother says I am a good boy.",
            "I love my family.",
        ],
        "Shopping": [
            "I go to the shop.",
            "I have some money.",
            "The shop has food and cloth.",
            "I take a book from the shelf.",
            "What is the price of this book?",
            "The price is good.",
            "I give the money to the man.",
            "I put the book in my bag.",
            "I take bread and meat from the shop.",
            "The shop is open.",
            "I get my food at the shop.",
            "Put the food in the bag.",
            "I go home from the shop.",
            "The shop has new cloth.",
            "I take a shirt for my father.",
        ],
        "At School": [
            "I go to school.",
            "The school is a great building.",
            "I have a book and pen.",
            "The teacher is at the school.",
            "I see my friend at school.",
            "The teacher gives us work.",
            "I do my work with my pen.",
            "I put my book on the table.",
            "The teacher says the word.",
            "I say the word again.",
            "My friend and I go through the door.",
            "We go to our room.",
            "The school has a garden.",
            "I see the garden through the window.",
            "I keep my book clean.",
        ],
        "Health": [
            "My body is healthy.",
            "I have a pain in my head.",
            "My heart is strong.",
            "I feel good.",
            "I have a pain in my back.",
            "Put your hand on your heart.",
            "The blood goes through your body.",
            "I see the doctor.",
            "The doctor says I am healthy.",
            "I keep my body clean.",
            "My eye has a pain.",
            "I have a bad cold.",
            "The doctor gives me medicine.",
            "I take the medicine with water.",
            "I get better.",
        ],
        "The House": [
            "This is my house.",
            "The house has four walls and a roof.",
            "The door is in the front wall.",
            "There are two windows in the house.",
            "I go in through the door.",
            "The floor is clean.",
            "I have a fire in the house.",
            "The house is warm.",
            "There is a garden by the house.",
            "I put a table and chairs in the house.",
            "My room is in the house.",
            "The house is my home.",
            "I keep the house clean.",
            "The roof is over the house.",
            "I see the sky through the window.",
        ],
    }
    
    for scene, sents in scene_sentences.items():
        for sent in sents:
            sentences.append({
                "step": 3,
                "scene": scene,
                "type": "scene_sentence",
                "sentence": sent
            })
    
    return sentences


def main():
    """主函数：生成所有训练数据"""
    import random
    random.seed(42)
    
    all_sentences = []
    
    # Step 1: Operator 基础句
    step1 = generate_step1()
    all_sentences.extend(step1)
    print(f"Step 1: {len(step1)} sentences")
    
    # Step 2: Operator × 方向 组合句
    step2 = generate_step2()
    all_sentences.extend(step2)
    print(f"Step 2: {len(step2)} sentences")
    
    # Step 3: 场景句子
    step3 = generate_step3()
    all_sentences.extend(step3)
    print(f"Step 3: {len(step3)} sentences")
    
    print(f"Total: {len(all_sentences)} sentences")
    
    # 写入文件
    output_path = "/Users/cuijianchen/Projects/ogden-audit/data/training-data-full.jsonl"
    with open(output_path, "w", encoding="utf-8") as f:
        for item in all_sentences:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")
    
    print(f"Written to {output_path}")
    
    # 统计
    step1_count = sum(1 for s in all_sentences if s["step"] == 1)
    step2_count = sum(1 for s in all_sentences if s["step"] == 2)
    step3_count = sum(1 for s in all_sentences if s["step"] == 3)
    
    print(f"\n=== Stats ===")
    print(f"Step 1 (Operator basics): {step1_count}")
    print(f"Step 2 (Op × Direction): {step2_count}")
    print(f"Step 3 (Scene sentences): {step3_count}")
    print(f"Total: {len(all_sentences)}")
    
    # 输出样本
    print(f"\n=== Sample (first 10) ===")
    for item in all_sentences[:10]:
        print(f"[S{item['step']}] {item['sentence']}")
    
    return all_sentences


if __name__ == "__main__":
    main()
