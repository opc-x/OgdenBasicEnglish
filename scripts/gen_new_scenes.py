#!/usr/bin/env python3
"""
生成 161 个新场景的训练句
每场景 3-5 句，只用 850 词 + operator 组合
"""
import json

# 161 新场景句子（每场景 3-5 句）
NEW_SCENES = {
    # === 日常生活 (30 scenes) ===
    "Waking Up": [
        {"en": "I get up at six every morning.", "zh": "我每天早上六点起床。"},
        {"en": "She gets up early in the morning.", "zh": "她早上起得早。"},
        {"en": "Get up and go to the door.", "zh": "起来，走到门口。"},
        {"en": "He got up from his bed.", "zh": "他从床上起来了。"},
        {"en": "They got up together.", "zh": "他们一起起床了。"},
    ],
    "Getting Dressed": [
        {"en": "I put on my coat.", "zh": "我穿上外套。"},
        {"en": "She puts on her dress.", "zh": "她穿上裙子。"},
        {"en": "He put on his shoes.", "zh": "他穿上鞋子。"},
        {"en": "Put your gloves on.", "zh": "戴上手套。"},
        {"en": "Do up your coat.", "zh": "把外套扣好。"},
    ],
    "Breakfast": [
        {"en": "I have bread and butter for breakfast.", "zh": "我早餐吃面包和黄油。"},
        {"en": "She puts butter on the bread.", "zh": "她在面包上涂黄油。"},
        {"en": "Give me some milk.", "zh": "给我一些牛奶。"},
        {"en": "He drinks milk every morning.", "zh": "他每天早上喝牛奶。"},
        {"en": "We have our meal at the table.", "zh": "我们在桌子上吃饭。"},
    ],
    "Going to Work": [
        {"en": "I go to work every morning.", "zh": "我每天早上上班。"},
        {"en": "She goes to work by bus.", "zh": "她坐公交车上班。"},
        {"en": "He went to work early.", "zh": "他很早就去上班了。"},
        {"en": "They go to work together.", "zh": "他们一起去上班。"},
        {"en": "I go from home to work.", "zh": "我从家去上班。"},
    ],
    "At the Office": [
        {"en": "I do my work at the office.", "zh": "我在办公室工作。"},
        {"en": "She puts her paper on the table.", "zh": "她把文件放在桌子上。"},
        {"en": "He does business with us.", "zh": "他和我们做生意。"},
        {"en": "We do good work together.", "zh": "我们一起做很好的工作。"},
        {"en": "They kept on with the work.", "zh": "他们继续工作。"},
    ],
    "Having Lunch": [
        {"en": "We have our meal at midday.", "zh": "我们中午吃饭。"},
        {"en": "I take food with me to work.", "zh": "我带食物去上班。"},
        {"en": "She gave me some bread.", "zh": "她给了我一些面包。"},
        {"en": "He has a meal at the office.", "zh": "他在办公室吃饭。"},
        {"en": "Put the food on the table.", "zh": "把食物放在桌子上。"},
    ],
    "Going Home": [
        {"en": "I go home from work in the evening.", "zh": "我晚上下班回家。"},
        {"en": "She went home from the office.", "zh": "她从办公室回家了。"},
        {"en": "He goes back to his house.", "zh": "他回到他的房子。"},
        {"en": "They went home together.", "zh": "他们一起回家了。"},
        {"en": "I came back from work.", "zh": "我从工作回来了。"},
    ],
    "Cooking Dinner": [
        {"en": "I make a meal at home.", "zh": "我在家做饭。"},
        {"en": "She puts the pot on the fire.", "zh": "她把锅放在火上。"},
        {"en": "He makes tea in the cup.", "zh": "他在杯子里泡茶。"},
        {"en": "Put some water in the pot.", "zh": "把一些水放进锅里。"},
        {"en": "The food is ready.", "zh": "食物准备好了。"},
    ],
    "Eating Dinner": [
        {"en": "Come to the table.", "zh": "来桌子这边。"},
        {"en": "Give me the bread.", "zh": "给我面包。"},
        {"en": "Put some salt on the meat.", "zh": "在肉上放些盐。"},
        {"en": "The meal is good.", "zh": "饭很好。"},
        {"en": "We have our food together.", "zh": "我们一起吃饭。"},
    ],
    "Washing Dishes": [
        {"en": "I put the plates in the water.", "zh": "我把盘子放进水里。"},
        {"en": "She takes the cloth and makes the plates clean.", "zh": "她拿起布把盘子擦干净。"},
        {"en": "He put the dishes away.", "zh": "他把碗碟收起来了。"},
        {"en": "Put the cover on the pot.", "zh": "把盖子盖在锅上。"},
        {"en": "Make the table clean.", "zh": "把桌子弄干净。"},
    ],
    "Watching TV": [
        {"en": "I see a picture on the television.", "zh": "我在电视上看到一幅画面。"},
        {"en": "She puts the light off.", "zh": "她把灯关了。"},
        {"en": "He is seeing the news.", "他正在看新闻。"},
        {"en": "Come and see this.", "zh": "过来看看这个。"},
        {"en": "Put the light on.", "zh": "把灯打开。"},
    ],
    "Going to Bed": [
        {"en": "I go to bed at night.", "zh": "我晚上去睡觉。"},
        {"en": "She puts her dress off.", "zh": "她脱掉裙子。"},
        {"en": "He put down the book.", "zh": "他放下了书。"},
        {"en": "Keep the light off.", "zh": "保持灯关着。"},
        {"en": "Make up the bed.", "zh": "整理床铺。"},
    ],
    "Brushing Teeth": [
        {"en": "I make my teeth clean every morning.", "zh": "我每天早上刷牙。"},
        {"en": "She puts some water on the brush.", "zh": "她在刷子上放些水。"},
        {"en": "He makes his teeth white.", "zh": "他把牙齿刷白。"},
        {"en": "Put the brush away.", "zh": "把刷子收起来。"},
        {"en": "Do this again.", "zh": "再做一遍。"},
    ],
    "Taking a Bath": [
        {"en": "I take a bath in the morning.", "zh": "我早上洗澡。"},
        {"en": "She puts hot water in the bath.", "zh": "她把热水放进浴缸。"},
        {"en": "He makes himself clean.", "zh": "他把自己洗干净。"},
        {"en": "Put some soap on your hands.", "zh": "在手上放些肥皂。"},
        {"en": "The water is warm.", "zh": "水是温暖的。"},
    ],
    "Cleaning the House": [
        {"en": "I make my house clean.", "zh": "我把房子打扫干净。"},
        {"en": "She puts things in the box.", "zh": "她把东西放进盒子里。"},
        {"en": "He took the dirt away.", "zh": "他把灰尘扫走了。"},
        {"en": "Put the cloth over the table.", "zh": "把布铺在桌子上。"},
        {"en": "They kept the house clean.", "zh": "他们保持房子干净。"},
    ],
    "Doing Laundry": [
        {"en": "I make my clothes clean.", "zh": "我把衣服洗干净。"},
        {"en": "She puts the cloth in the water.", "zh": "她把布放进水里。"},
        {"en": "He takes the cloth out.", "zh": "他把布拿出来。"},
        {"en": "Put the coat over the chair.", "zh": "把外套搭在椅子上。"},
        {"en": "The cloth is clean now.", "zh": "布现在干净了。"},
    ],
    "Watering Plants": [
        {"en": "I put water on the plants.", "zh": "我给植物浇水。"},
        {"en": "She gives water to the garden.", "zh": "她给花园浇水。"},
        {"en": "The flower comes out in spring.", "zh": "花在春天开。"},
        {"en": "Put some water in the pot.", "zh": "在花盆里放些水。"},
        {"en": "The plant is growing.", "zh": "植物在生长。"},
    ],
    "Feeding Pets": [
        {"en": "I give food to my dog.", "zh": "我给我的狗食物。"},
        {"en": "She puts water out for the cat.", "zh": "她给猫准备了水。"},
        {"en": "The dog eats the food.", "zh": "狗吃了食物。"},
        {"en": "Give some milk to the cat.", "zh": "给猫一些牛奶。"},
        {"en": "The animal is happy.", "zh": "动物很高兴。"},
    ],
    "Reading a Book": [
        {"en": "I have a book in my hand.", "zh": "我手里拿着一本书。"},
        {"en": "She is reading the book.", "zh": "她在读书。"},
        {"en": "He puts the book down.", "zh": "他放下了书。"},
        {"en": "Go through the book quickly.", "zh": "快速翻阅这本书。"},
        {"en": "I got through the book.", "zh": "我看完了这本书。"},
    ],
    "Writing a Letter": [
        {"en": "I make a letter to my friend.", "zh": "我给朋友写一封信。"},
        {"en": "She puts the letter in the box.", "zh": "她把信放进盒子里。"},
        {"en": "He sends off the letter.", "zh": "他把信寄出去了。"},
        {"en": "Put a stamp on the letter.", "zh": "在信上贴邮票。"},
        {"en": "I sent the letter back.", "zh": "我把信退回了。"},
    ],
    "Making a Phone Call": [
        {"en": "I make a call to my friend.", "zh": "我给朋友打电话。"},
        {"en": "She puts in the number.", "zh": "她拨了号码。"},
        {"en": "He says hello.", "zh": "他说你好。"},
        {"en": "Put down the phone.", "zh": "放下电话。"},
        {"en": "I sent out a call for help.", "zh": "我发出了求助电话。"},
    ],
    "Listening to Music": [
        {"en": "I hear music from the radio.", "zh": "我从收音机听到音乐。"},
        {"en": "She puts on the music.", "zh": "她播放音乐。"},
        {"en": "The sound is sweet.", "zh": "声音很甜美。"},
        {"en": "Turn the sound up.", "zh": "把声音调大。"},
        {"en": "Turn the sound down.", "zh": "把声音调小。"},
    ],
    "Taking Photos": [
        {"en": "I take a picture of the family.", "zh": "我给家人拍了一张照片。"},
        {"en": "She puts the camera up.", "zh": "她把相机举起来。"},
        {"en": "He takes a picture of the garden.", "zh": "他给花园拍了一张照片。"},
        {"en": "Put the picture on the wall.", "zh": "把照片挂在墙上。"},
        {"en": "The picture is beautiful.", "zh": "照片很美。"},
    ],
    "Exercising": [
        {"en": "I do exercise every morning.", "zh": "我每天早上锻炼。"},
        {"en": "She goes for a walk.", "zh": "她去散步。"},
        {"en": "He keeps his body strong.", "zh": "他保持身体强壮。"},
        {"en": "Do some work with your body.", "zh": "用身体做一些运动。"},
        {"en": "Keep on going.", "zh": "继续走。"},
    ],
    "Playing Games": [
        {"en": "We play a game together.", "zh": "我们一起玩游戏。"},
        {"en": "She has a good time.", "zh": "她玩得很开心。"},
        {"en": "He makes the first move.", "zh": "他先走一步。"},
        {"en": "Do not give up.", "zh": "不要放弃。"},
        {"en": "They played the game again.", "zh": "他们又玩了一次游戏。"},
    ],
    "Sewing and Mending": [
        {"en": "I put the thread through the needle.", "zh": "我把线穿过针眼。"},
        {"en": "She takes the cloth and makes a dress.", "zh": "她拿起布做了一件裙子。"},
        {"en": "He does up the button.", "zh": "他扣好了扣子。"},
        {"en": "Put the cloth together.", "zh": "把布缝在一起。"},
        {"en": "The dress is ready.", "zh": "裙子做好了。"},
    ],
    "Gardening": [
        {"en": "I put seeds in the earth.", "zh": "我把种子放进土里。"},
        {"en": "She gives water to the plants.", "zh": "她给植物浇水。"},
        {"en": "He takes the dirt away from the roots.", "zh": "他把根部的土清除掉。"},
        {"en": "The flowers come out in spring.", "zh": "花在春天开放。"},
        {"en": "Put some water on the garden.", "zh": "给花园浇水。"},
    ],
    "Fishing": [
        {"en": "I go to the river to get fish.", "zh": "我去河边钓鱼。"},
        {"en": "She puts the line in the water.", "zh": "她把线放进水里。"},
        {"en": "He takes a fish out of the water.", "zh": "他从水里钓出一条鱼。"},
        {"en": "The fish is good.", "zh": "鱼很好。"},
        {"en": "He makes a journey to the sea.", "zh": "他去海边旅行。"},
    ],
    "Camping": [
        {"en": "We put up the tent in the field.", "zh": "我们在田野里搭起帐篷。"},
        {"en": "She makes a fire.", "zh": "她生了火。"},
        {"en": "He keeps the fire going.", "zh": "他让火继续燃烧。"},
        {"en": "Put the cover over the tent.", "zh": "把罩子盖在帐篷上。"},
        {"en": "We had a good time in the open air.", "zh": "我们在户外玩得很开心。"},
    ],
    "Swimming": [
        {"en": "I go swimming in the summer.", "zh": "我夏天去游泳。"},
        {"en": "She goes into the water.", "zh": "她走进水里。"},
        {"en": "He comes out of the water.", "zh": "他从水里出来。"},
        {"en": "Put on your swimming clothing.", "zh": "穿上你的泳装。"},
        {"en": "The water is warm.", "zh": "水是温暖的。"},
    ],
    "Painting": [
        {"en": "I put some color on the paper.", "zh": "我在纸上涂了一些颜色。"},
        {"en": "She makes a picture of the garden.", "zh": "她画了花园的画。"},
        {"en": "He puts up the picture.", "zh": "他挂起了画。"},
        {"en": "Put some color on your brush.", "zh": "在你的刷子上涂些颜色。"},
        {"en": "The picture is beautiful.", "zh": "画很美。"},
    ],

    # === 社交场合 (20 scenes) ===
    "Greeting Someone": [
        {"en": "I say hello to my friend.", "zh": "我对朋友说你好。"},
        {"en": "She gives me a smile.", "zh": "她对我微笑。"},
        {"en": "He says good morning.", "zh": "他说早上好。"},
        {"en": "Come in and have a seat.", "zh": "进来坐。"},
        {"en": "How are you getting on?", "zh": "你怎么样了？"},
    ],
    "Saying Goodbye": [
        {"en": "I say goodbye to my friend.", "zh": "我对朋友说再见。"},
        {"en": "She saw him off at the door.", "zh": "她在门口送别了他。"},
        {"en": "Come back soon.", "zh": "快点回来。"},
        {"en": "We went to see her off.", "zh": "我们去送别她。"},
        {"en": "He went off without a word.", "zh": "他一句话没说就走了。"},
    ],
    "Thanking Someone": [
        {"en": "I give thanks to my friend.", "zh": "我感谢我的朋友。"},
        {"en": "She says thank you.", "zh": "她说谢谢。"},
        {"en": "He gives me help.", "zh": "他给了我帮助。"},
        {"en": "I give my thanks to the teacher.", "zh": "我感谢老师。"},
        {"en": "Give support when it is needed.", "zh": "在需要的时候给予帮助。"},
    ],
    "Apologizing": [
        {"en": "I say sorry to my friend.", "zh": "我对朋友说对不起。"},
        {"en": "She gave me her apology.", "zh": "她向我道歉了。"},
        {"en": "He let me down.", "zh": "他让我失望了。"},
        {"en": "I did harm to the plant.", "zh": "我伤害了植物。"},
        {"en": "Do not do harm to yourself.", "zh": "不要伤害自己。"},
    ],
    "Asking for Help": [
        {"en": "Give me some help.", "zh": "给我一些帮助。"},
        {"en": "I make a request for help.", "zh": "我请求帮助。"},
        {"en": "She gives help to the old man.", "zh": "她帮助了老人。"},
        {"en": "He gives help freely.", "zh": "他免费帮助别人。"},
        {"en": "Give help when you can.", "zh": "在你能够帮助的时候提供帮助。"},
    ],
    "Inviting Someone": [
        {"en": "Come to my house.", "zh": "来我家。"},
        {"en": "Have a seat and have some food.", "zh": "坐下来吃点东西。"},
        {"en": "Come in and have a meal.", "zh": "进来吃饭。"},
        {"en": "Have them in for a meal.", "zh": "请他们来家里吃饭。"},
        {"en": "I will make a meal for you.", "zh": "我会为你做一顿饭。"},
    ],
    "Accepting an Invitation": [
        {"en": "I will come to your house.", "zh": "我会来你家。"},
        {"en": "She gave me an offer of help.", "zh": "她给了我帮助的提议。"},
        {"en": "He makes a good offer.", "zh": "他给了一个好的提议。"},
        {"en": "I take up the offer.", "zh": "我接受了提议。"},
        {"en": "Give your offer in writing.", "zh": "以书面形式给出你的提议。"},
    ],
    "Declining Politely": [
        {"en": "I say no thank you.", "zh": "我说不，谢谢。"},
        {"en": "She gave no answer.", "zh": "她没有给出答案。"},
        {"en": "He keeps away from the trouble.", "zh": "他避开了麻烦。"},
        {"en": "I have no desire for that.", "zh": "我没有那个欲望。"},
        {"en": "Do not give in to fear.", "zh": "不要向恐惧屈服。"},
    ],
    "Congratulating": [
        {"en": "You did a good work.", "zh": "你做了一份好工作。"},
        {"en": "She made a great discovery.", "zh": "她有了一个伟大的发现。"},
        {"en": "He made the right decision.", "zh": "他做了正确的决定。"},
        {"en": "Keep up the good work.", "zh": "保持良好的工作。"},
        {"en": "You are getting on well.", "zh": "你进展得很好。"},
    ],
    "Giving Compliments": [
        {"en": "You have a beautiful dress.", "zh": "你有一条漂亮的裙子。"},
        {"en": "She makes good food.", "zh": "她做好的食物。"},
        {"en": "He does good work.", "zh": "他做好工作。"},
        {"en": "The picture is beautiful.", "zh": "画很美。"},
        {"en": "You have a kind heart.", "zh": "你有一颗善良的心。"},
    ],
    "Giving Advice": [
        {"en": "Do not give up.", "zh": "不要放弃。"},
        {"en": "Keep on with your work.", "zh": "继续你的工作。"},
        {"en": "Make a decision now.", "zh": "现在做决定。"},
        {"en": "Give your full attention.", "zh": "全神贯注。"},
        {"en": "Have belief in yourself.", "zh": "相信自己。"},
    ],
    "Expressing Worry": [
        {"en": "I have a fear of the dark.", "zh": "我害怕黑暗。"},
        {"en": "She seems worried.", "zh": "她看起来很担心。"},
        {"en": "He has a bad feeling.", "zh": "他有一种不好的感觉。"},
        {"en": "I cannot do with this noise.", "zh": "我受不了这个噪音。"},
        {"en": "They have fears about the future.", "zh": "他们对未来感到恐惧。"},
    ],
    "Expressing Joy": [
        {"en": "I feel happy today.", "zh": "我今天感到开心。"},
        {"en": "She has a happy feeling.", "zh": "她有一种开心的感觉。"},
        {"en": "He gives a smile.", "zh": "他微笑了。"},
        {"en": "I have a feeling of joy.", "zh": "我有一种喜悦的感觉。"},
        {"en": "The news made me happy.", "zh": "这消息让我开心。"},
    ],
    "Expressing Anger": [
        {"en": "The news made me angry.", "zh": "这消息让我生气。"},
        {"en": "I was down after the meeting.", "zh": "会后我情绪低落。"},
        {"en": "He kept on going despite my anger.", "zh": "尽管我生气，他还是继续。"},
        {"en": "She does not give in.", "zh": "她不屈服。"},
        {"en": "Do not let me down.", "zh": "不要让我失望。"},
    ],
    "Expressing Surprise": [
        {"en": "What do you have on?", "zh": "你穿了什么？"},
        {"en": "Come and see this.", "zh": "过来看看这个。"},
        {"en": "I came across a strange thing.", "zh": "我遇到了一件奇怪的事。"},
        {"en": "He came up with an idea.", "zh": "他想出了一个主意。"},
        {"en": "A question came up.", "zh": "出现了一个问题。"},
    ],
    "Offering Food": [
        {"en": "Have some bread.", "zh": "吃点面包。"},
        {"en": "Put some food on your plate.", "zh": "在你的盘子里放些食物。"},
        {"en": "Give me some milk.", "zh": "给我一些牛奶。"},
        {"en": "The meal is ready.", "zh": "饭准备好了。"},
        {"en": "Come and eat.", "zh": "来吃吧。"},
    ],
    "Borrowing Things": [
        {"en": "Give me back my book.", "zh": "把我的书还给我。"},
        {"en": "I will give it back tomorrow.", "zh": "我明天会还的。"},
        {"en": "She gave away her old clothes.", "zh": "她把旧衣服送人了。"},
        {"en": "He keeps the book for a week.", "zh": "他保留这本书一周。"},
        {"en": "Get the book back from her.", "zh": "从她那里拿回书。"},
    ],
    "Lending Things": [
        {"en": "I give my book to you.", "zh": "我把我的书给你。"},
        {"en": "She lets me have her pen.", "zh": "她让我用她的笔。"},
        {"en": "He gives help when he can.", "zh": "他在能帮助的时候给予帮助。"},
        {"en": "Let him off this time.", "zh": "这次放过他。"},
        {"en": "Give your support to the cause.", "zh": "支持这项事业。"},
    ],
    "Making a Promise": [
        {"en": "I will do the work tomorrow.", "zh": "我明天做这个工作。"},
        {"en": "She gives her word.", "zh": "她保证了。"},
        {"en": "He will not let you down.", "zh": "他不会让你失望的。"},
        {"en": "Do not give in.", "zh": "不要屈服。"},
        {"en": "Keep on, do not stop.", "zh": "继续，不要停。"},
    ],
    "Breaking a Promise": [
        {"en": "He let me down.", "zh": "他让我失望了。"},
        {"en": "She gave up her hope.", "zh": "她放弃了希望。"},
        {"en": "He did not see the work through.", "zh": "他没有把工作做到底。"},
        {"en": "Do not give up.", "zh": "不要放弃。"},
        {"en": "They gave up the town.", "zh": "他们放弃了城镇。"},
    ],

    # === 工作场合 (20 scenes) ===
    "Job Interview": [
        {"en": "I go to the office for an interview.", "zh": "我去办公室面试。"},
        {"en": "She gives me some questions.", "zh": "她给了我一些问题。"},
        {"en": "I give the answer to all questions.", "zh": "我回答了所有问题。"},
        {"en": "He makes a good impression.", "zh": "他给人留下了好印象。"},
        {"en": "I make a request for the work.", "zh": "我请求这份工作。"},
    ],
    "Giving a Presentation": [
        {"en": "I give a talk to the group.", "zh": "我给团队做了一次演讲。"},
        {"en": "She puts up the picture.", "zh": "她挂起了画。"},
        {"en": "He keeps on talking.", "zh": "他继续说着。"},
        {"en": "Go through the papers.", "zh": "翻阅文件。"},
        {"en": "I make my point clear.", "zh": "我把我的观点说清楚了。"},
    ],
    "In a Meeting": [
        {"en": "We make decisions together.", "zh": "我们一起做决定。"},
        {"en": "She puts up a new idea.", "zh": "她提出了一个新想法。"},
        {"en": "He goes through the account.", "zh": "他检查了账目。"},
        {"en": "The meeting went on for hours.", "zh": "会议开了几个小时。"},
        {"en": "They had the argument out.", "zh": "他们把争论说清楚了。"},
    ],
    "Giving Orders": [
        {"en": "Give your orders now.", "zh": "现在给出你的命令。"},
        {"en": "He gives orders all day.", "zh": "他整天发号施令。"},
        {"en": "She gave the order to stop.", "zh": "她下命令停止。"},
        {"en": "Do the work quickly.", "zh": "快点做工作。"},
        {"en": "Get on with it.", "zh": "继续做。"},
    ],
    "Following Instructions": [
        {"en": "Do the work as I say.", "zh": "按照我说的做工作。"},
        {"en": "She keeps to the rules.", "zh": "她遵守规则。"},
        {"en": "He does what he is told.", "zh": "他按照被告知的去做。"},
        {"en": "Do up the buttons.", "zh": "扣好扣子。"},
        {"en": "Put your things together.", "zh": "把你的东西整理好。"},
    ],
    "Asking for a Raise": [
        {"en": "I make a request for more pay.", "zh": "我请求加薪。"},
        {"en": "She puts in a good word for me.", "zh": "她说了一句好话替我。"},
        {"en": "He makes a comparison between the work and the pay.", "zh": "他在工作和薪水之间做了比较。"},
        {"en": "I give support to the request.", "zh": "我支持这个请求。"},
        {"en": "We did good work together.", "zh": "我们一起做了很好的工作。"},
    ],
    "Making Small Talk": [
        {"en": "How are you getting on?", "zh": "你怎么样了？"},
        {"en": "The weather is good today.", "zh": "今天天气很好。"},
        {"en": "I come from the country.", "zh": "我来自乡下。"},
        {"en": "She has a look at the picture.", "zh": "她看了看那幅画。"},
        {"en": "He came up with an idea.", "zh": "他想出了一个主意。"},
    ],
    "Reporting a Problem": [
        {"en": "I see a problem with the work.", "zh": "我看到了工作中的一个问题。"},
        {"en": "She puts the problem to the manager.", "zh": "她把问题提给了经理。"},
        {"en": "He goes through the details.", "zh": "他检查了细节。"},
        {"en": "The machine gives off smoke.", "zh": "机器冒烟。"},
        {"en": "See to the fire.", "zh": "照看火。"},
    ],
    "Resolving a Conflict": [
        {"en": "Let us have it out.", "zh": "我们来把话说清楚。"},
        {"en": "She made up with her friend.", "zh": "她和朋友和好了。"},
        {"en": "He gave in at last.", "zh": "他最终屈服了。"},
        {"en": "They kept out of the fight.", "zh": "他们避开了打斗。"},
        {"en": "Do not do harm to yourself.", "zh": "不要伤害自己。"},
    ],
    "Training a New Employee": [
        {"en": "I give help to the new person.", "zh": "我帮助新来的人。"},
        {"en": "She shows the way to do the work.", "zh": "她展示了做工作的方法。"},
        {"en": "He goes through the steps.", "zh": "他一步步来。"},
        {"en": "Keep on with the learning.", "zh": "继续学习。"},
        {"en": "You are getting on well.", "zh": "你进展得很好。"},
    ],
    "Firing Someone": [
        {"en": "We have to let you go.", "zh": "我们不得不让你走。"},
        {"en": "He did not keep up with the work.", "zh": "他跟不上工作。"},
        {"en": "She goes from the office today.", "zh": "她今天从办公室离开。"},
        {"en": "We will give you help to find new work.", "zh": "我们会帮助你找新工作。"},
        {"en": "Go with our good wishes.", "zh": "带着我们的祝福走吧。"},
    ],
    "Taking a Break": [
        {"en": "I have a quick look at the time.", "zh": "我快速看了一眼时间。"},
        {"en": "She takes a short rest.", "zh": "她短暂休息了一下。"},
        {"en": "He puts down his work.", "zh": "他放下了工作。"},
        {"en": "I could do with a drink.", "zh": "我需要喝点什么。"},
        {"en": "Take a look for yourself.", "zh": "你自己看看。"},
    ],
    "Working Overtime": [
        {"en": "I keep on working through the night.", "zh": "我整夜继续工作。"},
        {"en": "She keeps the fire going.", "zh": "她让火继续燃烧。"},
        {"en": "He does not give up.", "zh": "他不放弃。"},
        {"en": "They put in extra time on the work.", "zh": "他们在工作上投入了额外时间。"},
        {"en": "Get through the work.", "zh": "完成工作。"},
    ],
    "Dealing with a Difficult Client": [
        {"en": "The man gives us trouble.", "zh": "那个人给我们带来了麻烦。"},
        {"en": "She keeps out of the trouble.", "zh": "她避开了麻烦。"},
        {"en": "He makes a decision quickly.", "zh": "他迅速做了决定。"},
        {"en": "I will see about the problem.", "zh": "我会处理这个问题。"},
        {"en": "Give help when it is needed.", "zh": "在需要的时候给予帮助。"},
    ],
    "Networking": [
        {"en": "I go to meet new people.", "zh": "我去见新的人。"},
        {"en": "She gives me her name and number.", "zh": "她给了她她的名字和号码。"},
        {"en": "He comes up with a good idea.", "zh": "他想出了一个好主意。"},
        {"en": "We do business together.", "zh": "我们一起做生意。"},
        {"en": "Give your offer in writing.", "zh": "以书面形式提供你的提议。"},
    ],
    "Organizing an Event": [
        {"en": "I put together a plan for the event.", "zh": "我为这个活动做了一个计划。"},
        {"en": "She gives out the papers to the group.", "zh": "她把文件分发给团队。"},
        {"en": "He puts up the flag.", "zh": "他升起了旗子。"},
        {"en": "Come and see the event.", "zh": "来看看吧。"},
        {"en": "The event went off well.", "zh": "活动进行得很好。"},
    ],
    "Negotiating": [
        {"en": "I give an offer.", "zh": "我给出一个提议。"},
        {"en": "She makes a comparison between the prices.", "zh": "她在价格之间做了比较。"},
        {"en": "He does not give in.", "zh": "他不屈服。"},
        {"en": "We make a decision together.", "zh": "我们一起做决定。"},
        {"en": "Give your support to the plan.", "zh": "支持这个计划。"},
    ],
    "Making a Complaint": [
        {"en": "I have a complaint about the work.", "zh": "我对工作有投诉。"},
        {"en": "She gives the complaint to the office.", "zh": "她把投诉提交给了办公室。"},
        {"en": "He sees to the problem.", "zh": "他处理了问题。"},
        {"en": "What do you do with this?", "zh": "你用这个做什么？"},
        {"en": "I will see about it.", "zh": "我会处理的。"},
    ],
    "Giving Feedback": [
        {"en": "You did good work.", "zh": "你做了好工作。"},
        {"en": "Keep on with the learning.", "zh": "继续学习。"},
        {"en": "Do it over again.", "zh": "再做一遍。"},
        {"en": "Make a change now.", "zh": "现在做一个改变。"},
        {"en": "You are getting on well.", "zh": "你进展得很好。"},
    ],
    "Ending a Work Day": [
        {"en": "I go home from work.", "zh": "我下班回家。"},
        {"en": "She puts away her work.", "zh": "她收拾好了工作。"},
        {"en": "He keeps the light on.", "zh": "他让灯开着。"},
        {"en": "Put your things together.", "zh": "把你的东西整理好。"},
        {"en": "Come back tomorrow.", "zh": "明天回来。"},
    ],

    # === 紧急情况 (15 scenes) ===
    "Calling the Police": [
        {"en": "Send for the police.", "zh": "派人去叫警察。"},
        {"en": "I sent for help.", "zh": "我派人去求助。"},
        {"en": "He gives the order to go.", "zh": "他下命令离开。"},
        {"en": "Go out quickly.", "zh": "快点出去。"},
        {"en": "Keep out of danger.", "zh": "远离危险。"},
    ],
    "Reporting an Accident": [
        {"en": "I see an accident on the road.", "zh": "我在路上看到了一场事故。"},
        {"en": "She sends out for help.", "zh": "她派人去求助了。"},
        {"en": "He keeps the crowd back.", "zh": "他让人群退后。"},
        {"en": "Give help when it is needed.", "zh": "在需要的时候给予帮助。"},
        {"en": "I saw the ship off.", "zh": "我送别了船。"},
    ],
    "First Aid": [
        {"en": "I give first aid to the injured person.", "zh": "我给受伤的人做了急救。"},
        {"en": "She puts a cloth over the wound.", "zh": "她在伤口上放了块布。"},
        {"en": "He keeps the person warm.", "zh": "他保持那个人温暖。"},
        {"en": "Get help quickly.", "zh": "快去找帮助。"},
        {"en": "Send for the doctor.", "zh": "派人去叫医生。"},
    ],
    "Natural Disaster": [
        {"en": "The rain comes down heavily.", "zh": "雨下得很大。"},
        {"en": "The wind goes through the trees.", "zh": "风吹过树林。"},
        {"en": "Get out of the house quickly.", "zh": "快点从房子里出来。"},
        {"en": "Go to high ground.", "zh": "去高处。"},
        {"en": "Send for help.", "zh": "去求助。"},
    ],
    "Getting Lost": [
        {"en": "I went in the wrong way.", "zh": "我走错了路。"},
        {"en": "Ask the way to the station.", "zh": "去问去车站的路。"},
        {"en": "The man says go down this road.", "zh": "那人说沿着这条路走。"},
        {"en": "Go across the bridge.", "zh": "过桥。"},
        {"en": "I got back on the right road.", "zh": "我回到了正确的路上。"},
    ],
    "Missing a Flight": [
        {"en": "I came late to the gate.", "zh": "我到登机口晚了。"},
        {"en": "The plane took off without me.", "zh": "飞机没有等我起飞了。"},
        {"en": "Go back and get another flight.", "zh": "回去换另一个航班。"},
        {"en": "Do not give up.", "zh": "不要放弃。"},
        {"en": "Make an attempt to go again.", "zh": "再试一次。"},
    ],
    "Losing Wallet": [
        {"en": "I cannot find my money.", "zh": "我找不到我的钱。"},
        {"en": "She gives me back my key.", "zh": "她把钥匙还给了我。"},
        {"en": "He sends back the goods.", "zh": "他退回了货物。"},
        {"en": "Get back what you lost.", "zh": "找回你丢失的东西。"},
        {"en": "See about the problem.", "zh": "处理这个问题。"},
    ],
    "Being Robbed": [
        {"en": "The man took away my money.", "zh": "那个人拿走了我的钱。"},
        {"en": "Send for the police.", "zh": "派人去叫警察。"},
        {"en": "He made off quickly.", "zh": "他迅速离开了。"},
        {"en": "Give help when you can.", "zh": "在你能够帮助的时候提供帮助。"},
        {"en": "Keep out of danger.", "zh": "远离危险。"},
    ],
    "Fire Emergency": [
        {"en": "There is a fire.", "zh": "着火了。"},
        {"en": "Put out the fire with water.", "zh": "用水灭火。"},
        {"en": "Go out of the house quickly.", "zh": "快点从房子里出去。"},
        {"en": "The fire is put out.", "zh": "火被扑灭了。"},
        {"en": "Send for help.", "zh": "去求助。"},
    ],
    "Medical Emergency": [
        {"en": "The person has a pain in the heart.", "zh": "那个人心脏疼。"},
        {"en": "Send for the doctor.", "zh": "派人去叫医生。"},
        {"en": "Keep the person warm.", "zh": "保持那个人温暖。"},
        {"en": "Do not give up.", "zh": "不要放弃。"},
        {"en": "See to the person.", "zh": "照顾那个人。"},
    ],
    "Car Breakdown": [
        {"en": "The car is not going.", "zh": "车不走了。"},
        {"en": "He sees to the engine.", "zh": "他检查了引擎。"},
        {"en": "Send for help.", "zh": "去求助。"},
        {"en": "Do not keep on going.", "zh": "不要继续走了。"},
        {"en": "Put the car in a safe place.", "zh": "把车放在安全的地方。"},
    ],
    "Power Outage": [
        {"en": "The light went off.", "zh": "灯灭了。"},
        {"en": "Put the fire on.", "zh": "生火。"},
        {"en": "Keep the heat in.", "zh": "保持热量。"},
        {"en": "Do not give up.", "zh": "不要放弃。"},
        {"en": "See about the problem.", "zh": "处理这个问题。"},
    ],
    "Water Leak": [
        {"en": "Water is coming in through the roof.", "zh": "水从屋顶漏进来了。"},
        {"en": "Put a pot under the leak.", "zh": "在漏水处放一个锅。"},
        {"en": "Send for help.", "zh": "去求助。"},
        {"en": "Keep the water out.", "zh": "挡住水。"},
        {"en": "See to the problem.", "zh": "处理这个问题。"},
    ],
    "Animal Attack": [
        {"en": "The dog is coming at me.", "zh": "狗朝我冲过来。"},
        {"en": "Keep off!", "zh": "走开！"},
        {"en": "Get out of the way.", "zh": "让开。"},
        {"en": "Do not give in to fear.", "zh": "不要向恐惧屈服。"},
        {"en": "Go back to a safe place.", "zh": "回到安全的地方。"},
    ],
    "Stranger Danger": [
        {"en": "A strange man is coming to me.", "zh": "一个陌生人在向我走来。"},
        {"en": "I do not have trust in him.", "zh": "我不信任他。"},
        {"en": "Get out of the way.", "zh": "让开。"},
        {"en": "Go back home.", "zh": "回家。"},
        {"en": "Send for help.", "zh": "去求助。"},
    ],

    # === 旅行场景 (20 scenes) ===
    "Booking a Hotel": [
        {"en": "I make a request for a room.", "zh": "我请求一个房间。"},
        {"en": "She gives me a price.", "zh": "她给了我一个价格。"},
        {"en": "He puts up his friend for the night.", "zh": "他让朋友过夜。"},
        {"en": "Give your name and address.", "zh": "给出你的名字和地址。"},
        {"en": "I make a decision.", "zh": "我做了一个决定。"},
    ],
    "Checking into a Hotel": [
        {"en": "I come in through the front door.", "zh": "我从前门进来。"},
        {"en": "Put your name on the paper.", "zh": "在纸上写下你的名字。"},
        {"en": "Give me the key to my room.", "zh": "给我房间的钥匙。"},
        {"en": "My room is on the second floor.", "zh": "我的房间在二楼。"},
        {"en": "Keep the room clean.", "zh": "保持房间干净。"},
    ],
    "At a Restaurant": [
        {"en": "Come to the table.", "zh": "来桌子这边。"},
        {"en": "Give me some bread and water.", "zh": "给我一些面包和水。"},
        {"en": "The meal is good.", "zh": "饭很好。"},
        {"en": "Put some salt on the meat.", "zh": "在肉上放些盐。"},
        {"en": "Give me the price of the meal.", "zh": "给我饭的价格。"},
    ],
    "Ordering Food": [
        {"en": "What do you have?", "zh": "你们有什么？"},
        {"en": "Give me some meat and bread.", "zh": "给我一些肉和面包。"},
        {"en": "Put some butter on the bread.", "zh": "在面包上涂些黄油。"},
        {"en": "The food is ready.", "zh": "食物准备好了。"},
        {"en": "Do not put off the meal.", "zh": "不要推迟吃饭。"},
    ],
    "Asking for Directions": [
        {"en": "Where is the station?", "zh": "车站在哪里？"},
        {"en": "Go down this road.", "zh": "沿着这条路走。"},
        {"en": "Go across the bridge.", "zh": "过桥。"},
        {"en": "Turn at the next corner.", "zh": "在下一个拐角转弯。"},
        {"en": "I give you my thanks.", "zh": "我感谢你。"},
    ],
    "At the Airport": [
        {"en": "I go to the airport.", "zh": "我去机场。"},
        {"en": "The plane takes off at six.", "zh": "飞机六点起飞。"},
        {"en": "Get on the plane.", "zh": "上飞机。"},
        {"en": "Keep your seat on.", "zh": "保持你的座位。"},
        {"en": "The plane went down in the night.", "zh": "飞机在夜里降落了。"},
    ],
    "Going Through Customs": [
        {"en": "I have nothing to say.", "zh": "我没有什么要说的。"},
        {"en": "Open your bag.", "zh": "打开你的包。"},
        {"en": "Go through the door.", "zh": "穿过门。"},
        {"en": "Keep your paper ready.", "zh": "把你的文件准备好。"},
        {"en": "Do as you are told.", "zh": "按照被告知的去做。"},
    ],
    "At the Train Station": [
        {"en": "I go to the station.", "zh": "我去车站。"},
        {"en": "The train comes in at six.", "zh": "火车六点到站。"},
        {"en": "Get on the train.", "zh": "上火车。"},
        {"en": "Give your ticket to the man.", "zh": "把你的票给那个人。"},
        {"en": "The train goes through the country.", "zh": "火车穿过乡间。"},
    ],
    "Taking a Taxi": [
        {"en": "Take me to the hotel.", "zh": "带我去酒店。"},
        {"en": "Go down this road.", "zh": "沿着这条路走。"},
        {"en": "Stop at the door.", "zh": "在门口停车。"},
        {"en": "What is the price?", "zh": "多少钱？"},
        {"en": "Give me back my change.", "zh": "把我的零钱还给我。"},
    ],
    "Visiting a Museum": [
        {"en": "I go to see the pictures.", "zh": "我去看画。"},
        {"en": "Put your bag at the door.", "zh": "把包放在门口。"},
        {"en": "Keep off the art.", "zh": "不要碰艺术品。"},
        {"en": "Go through the rooms slowly.", "zh": "慢慢穿过房间。"},
        {"en": "The museum is a beautiful building.", "zh": "博物馆是一栋美丽的建筑。"},
    ],
    "Sightseeing": [
        {"en": "The building is beautiful.", "zh": "建筑很美。"},
        {"en": "Put up the picture.", "zh": "挂起画来。"},
        {"en": "Go up and see the view.", "zh": "上去看看景色。"},
        {"en": "The garden is by the house.", "zh": "花园在房子旁边。"},
        {"en": "Come and see this.", "zh": "过来看看这个。"},
    ],
    "Shopping for Souvenirs": [
        {"en": "What is the price of this?", "zh": "这个多少钱？"},
        {"en": "Give me some help.", "zh": "给我一些帮助。"},
        {"en": "Put the thing in a bag.", "zh": "把东西放进包里。"},
        {"en": "Do not give too much money.", "zh": "不要给太多钱。"},
        {"en": "Give your offer.", "zh": "给出你的出价。"},
    ],
    "Taking a Bus": [
        {"en": "Get on the bus.", "zh": "上公交车。"},
        {"en": "Get off at the next stop.", "zh": "在下一站下车。"},
        {"en": "The bus goes through the town.", "zh": "公交车穿过城镇。"},
        {"en": "Keep your seat.", "zh": "保持你的座位。"},
        {"en": "The bus takes me to the station.", "zh": "公交车带我到车站。"},
    ],
    "Renting a Car": [
        {"en": "I make a request for a car.", "zh": "我请求一辆车。"},
        {"en": "Give me the key.", "zh": "给我钥匙。"},
        {"en": "Put some oil in the car.", "zh": "给车加些油。"},
        {"en": "Drive on the right side.", "zh": "在右边行驶。"},
        {"en": "Give the car back at the airport.", "zh": "在机场还车。"},
    ],
    "At the Beach": [
        {"en": "The sea is beautiful.", "zh": "大海很美。"},
        {"en": "Put on your swimming clothing.", "zh": "穿上你的泳装。"},
        {"en": "Go into the water.", "zh": "走进水里。"},
        {"en": "The sand is warm.", "zh": "沙子是温暖的。"},
        {"en": "Come out of the sun.", "zh": "从太阳下出来。"},
    ],
    "Hiking": [
        {"en": "We go up the mountain.", "zh": "我们上山。"},
        {"en": "Keep on going.", "zh": "继续走。"},
        {"en": "The steps are hard.", "zh": "台阶很陡。"},
        {"en": "I got up the steps.", "zh": "我走上了台阶。"},
        {"en": "The view from the top is beautiful.", "zh": "从顶上看风景很美。"},
    ],
    "Camping Trip": [
        {"en": "Put up the tent.", "zh": "搭起帐篷。"},
        {"en": "Make a fire.", "zh": "生火。"},
        {"en": "Keep the fire going.", "zh": "让火继续燃烧。"},
        {"en": "Put the food in a box.", "zh": "把食物放进盒子里。"},
        {"en": "The air in the open is clean.", "zh": "户外的空气很清新。"},
    ],
    "Photography Tour": [
        {"en": "I take pictures of the country.", "zh": "我给乡村拍照片。"},
        {"en": "Put the camera up to your eye.", "zh": "把相机举到眼前。"},
        {"en": "The light is good.", "zh": "光线很好。"},
        {"en": "Take a picture of the garden.", "zh": "给花园拍张照片。"},
        {"en": "The picture came out well.", "zh": "照片拍得很好。"},
    ],
    "Nightlife": [
        {"en": "We go out at night.", "zh": "我们晚上出去。"},
        {"en": "The music is loud.", "zh": "音乐很响。"},
        {"en": "He puts on a good show.", "zh": "他做了一场好的表演。"},
        {"en": "Go with me to the show.", "zh": "和我一起去看表演。"},
        {"en": "Come back home late.", "zh": "很晚才回家。"},
    ],
    "New Year Celebration": [
        {"en": "Happy New Year!", "zh": "新年快乐！"},
        {"en": "We have a good time together.", "zh": "我们一起玩得很开心。"},
        {"en": "Put up the flag.", "zh": "升起旗子。"},
        {"en": "The year comes in.", "zh": "新的一年到来了。"},
        {"en": "Give support to your friends.", "zh": "支持你的朋友。"},
    ],
}

# 生成新句子列表
new_sentences = []
idx = 30000
for scene_name, sents in NEW_SCENES.items():
    for s in sents:
        idx += 1
        new_sentences.append({
            "id": idx,
            "step": 3,
            "type": "scene_sentence",
            "scene": scene_name,
            "sentence": s["en"],
            "zh": s["zh"],
        })

print(f"Generated {len(new_sentences)} new sentences in {len(NEW_SCENES)} scenes")
print(f"Scenes: {list(NEW_SCENES.keys())[:10]}...")

# 读取现有数据并合并
data_path = "/Users/cuijianchen/Projects/OgdenBasicEnglish/data/training-core.jsonl"
existing = []
with open(data_path, "r") as f:
    for line in f:
        if line.strip():
            existing.append(json.loads(line.strip()))

existing_sents = set(s["sentence"] for s in existing)
print(f"Existing: {len(existing)}")

# 去重
added = 0
for s in new_sentences:
    if s["sentence"] not in existing_sents:
        existing.append(s)
        added += 1
        existing_sents.add(s["sentence"])

print(f"Added: {added}")
print(f"Total: {len(existing)}")

# 写文件
with open(data_path, "w") as f:
    for s in existing:
        f.write(json.dumps(s, ensure_ascii=False) + "\n")
print("Written!")
