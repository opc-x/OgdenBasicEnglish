#!/usr/bin/env python3
"""
为 981 句训练数据生成中文翻译
规则：简洁、口语化、准确传达 Ogden 短语动词含义
"""
import json

# 全部 981 句子的中文翻译
# 格式: "英文": "中文"
TRANSLATIONS = {
    # put on (wear 穿)
    "Put the coat on.": "把外套穿上。",
    "I put my coat on.": "我穿上我的外套。",
    "She put her hat on.": "她戴上她的帽子。",
    "He is putting his shoes on.": "他正在穿鞋。",
    "Put your gloves on before you go out.": "出去前戴上手套。",
    "I will put on my new dress.": "我会穿上我的新裙子。",
    "She put some color on the paper.": "她在纸上涂了些颜色。",
    # put (放)
    "Put the book on the table.": "把书放在桌子上。",
    "I put the plate on the shelf.": "我把盘子放在架子上。",
    "He put his hand on my arm.": "他把手放在我的胳膊上。",
    "She put the key on the hook.": "她把钥匙挂在钩子上。",
    "Put the picture on the wall.": "把画挂在墙上。",
    "I put my foot on the step.": "我把脚放在台阶上。",
    "They put a cover on the bed.": "他们把罩子盖在床上。",
    "We put the cloth on the table.": "我们把布放在桌子上。",
    "Put the butter on the bread.": "把黄油涂在面包上。",
    "I put the stamp on the letter.": "我把邮票贴在信上。",
    "He put a ring on her finger.": "他把戒指戴在她手指上。",
    # put off (postpone 推迟)
    "Put off the meeting.": "把会议推迟。",
    "I put off my work till tomorrow.": "我把工作推迟到明天。",
    "She put off her journey.": "她推迟了她的旅行。",
    "They put the decision off.": "他们推迟了决定。",
    "He is putting off the talk.": "他正在推迟谈话。",
    "We put off the meal.": "我们推迟了吃饭。",
    "Do not put off your learning.": "不要推迟你的学习。",
    "She put off the payment.": "她推迟了付款。",
    "Put the light off.": "把灯关掉。",
    "I put the fire off.": "我把火关了。",
    "He put off his coat.": "他脱掉了外套。",
    "She put off her shoes.": "她脱掉了鞋子。",
    "They put off the event.": "他们推迟了活动。",
    # put out (extinguish 熄灭)
    "Put out the fire.": "把火熄灭。",
    "I put out the light.": "我把灯关了。",
    "He put the flame out.": "他把火焰熄灭了。",
    "They put out the burn.": "他们把烧伤处理了。",
    "I put the cat out of the room.": "我把猫弄出房间。",
    "She put her hand out.": "她伸出手。",
    "He put out a new book.": "他出版了一本新书。",
    "They put out the statement.": "他们发表了声明。",
    # put up (raise 举起)
    "Put up the picture.": "把画挂起来。",
    "I put my hand up.": "我举起手。",
    "She put up the flag.": "她升起了旗子。",
    "He put up a new building.": "他建了一栋新楼。",
    "Put your arm up.": "把你的胳膊举起来。",
    "They put up the shelf.": "他们架上了架子。",
    "I put up the curtain.": "我挂上了窗帘。",
    "She put up the price.": "她提高了价格。",
    "We put our friend up for the night.": "我们让朋友过夜。",
    "He put up a fight.": "他进行了一场战斗。",
    # put down (lower 放下)
    "Put the book down.": "把书放下。",
    "I put down the knife.": "我放下刀。",
    "She put her foot down.": "她踩下了脚。",
    "He put the box down on the floor.": "他把箱子放在地板上。",
    "Put your pen down.": "把你的笔放下。",
    "They put down the gun.": "他们放下了枪。",
    "I put my name down on the paper.": "我在纸上写下了我的名字。",
    "She put the baby down.": "她把婴儿放下了。",
    "He put down the noise.": "他制止了噪音。",
    "We put the money down.": "我们付了钱。",
    # put in (insert 放入)
    "Put the key in the lock.": "把钥匙放进锁里。",
    "I put the letter in the box.": "我把信放进盒子里。",
    "She put the milk in the cup.": "她把牛奶放进杯子里。",
    "He put his hand in his pocket.": "他把手放进口袋里。",
    "Put the flower in the pot.": "把花放进花盆里。",
    "They put the money in the bank.": "他们把钱存进银行。",
    "I put in a request.": "我提出了一个请求。",
    "She put in a good word for me.": "她说了一句好话替我。",
    "He put the wire in the hole.": "他把电线放进孔里。",
    # put through (connect 接通)
    "Put the wire through the hole.": "把电线穿过孔。",
    "I put the thread through the needle.": "我把线穿过针眼。",
    "She put the call through.": "她接通了电话。",
    "He put the plan through.": "他执行了这个计划。",
    "Put me through to the office.": "帮我接通办公室。",
    "They put the work through quickly.": "他们快速完成了工作。",
    # put together (assemble 组装)
    "Put the table together.": "把桌子组装起来。",
    "I put the parts together.": "我把零件组装在一起。",
    "She put the machine together.": "她把机器组装好了。",
    "Put your things together.": "把你的东西整理好。",
    "We put our ideas together.": "我们把想法汇总在一起。",
    # put over (cover 覆盖)
    "Put the cover over the pot.": "把盖子盖上锅。",
    "I put my coat over the seat.": "我把外套放在座位上。",
    "She put an umbrella over her head.": "她把伞撑在头上。",
    "He put a cloth over the table.": "他在桌子上铺了一块布。",
    "Put your hand over your mouth.": "用手捂住嘴巴。",
    "They put a roof over the house.": "他们给房子盖了屋顶。",
    # take off (remove 脱下/起飞)
    "Take your coat off.": "把外套脱掉。",
    "I took off my shoes.": "我脱掉了鞋子。",
    "She took the ring off her finger.": "她把戒指从手指上取下。",
    "He is taking off his hat.": "他正在脱帽子。",
    "Take the cover off the bed.": "把床罩拿掉。",
    "I took the book off the shelf.": "我从书架上拿走了书。",
    "She took the skin off the orange.": "她剥了橘子的皮。",
    "He took a day off.": "他请了一天假。",
    "The plane took off.": "飞机起飞了。",
    "I took the picture off the wall.": "我把画从墙上取下来。",
    "She took off her dress.": "她脱掉了裙子。",
    "Take your hand off the table.": "把手从桌子上拿开。",
    # take out (extract 取出)
    "Take the book out of the box.": "把书从盒子里拿出来。",
    "I took the key out of my pocket.": "我从口袋里掏出钥匙。",
    "She took the letter out.": "她把信拿了出来。",
    "He took out his pen.": "他拿出了他的笔。",
    "Take the milk out of the cup.": "把牛奶从杯子里取出来。",
    "I took her out for a meal.": "我带她出去吃饭。",
    "She took out the nail.": "她把钉子拔了出来。",
    "They took the money out of the bank.": "他们从银行取出了钱。",
    "Take the seed out of the fruit.": "把种子从水果里取出来。",
    # take in (absorb 吸收/接待)
    "I took in the view.": "我欣赏了风景。",
    "She took in the story.": "她听进了这个故事。",
    "He took in the knowledge.": "他吸收了知识。",
    "Take in what I am saying.": "听进去我说的话。",
    "I took the cat in.": "我收留了猫。",
    "They took in a friend for the night.": "他们收留了一个朋友过夜。",
    # take up (begin 开始/占据)
    "Take up a new interest.": "培养一个新的兴趣。",
    "I took up the offer.": "我接受了提议。",
    "She took up the work.": "她开始了工作。",
    "He took up the pen.": "他拿起了笔。",
    "Take up your book.": "拿起你的书。",
    "We took up the question.": "我们提出了这个问题。",
    "She took up the floor.": "她占据了地板。",
    # take down (lower 记下/取下)
    "Take down the picture.": "把画取下来。",
    "I took the curtain down.": "我把窗帘取下来了。",
    "She took down the numbers.": "她记下了数字。",
    "He took the shelf down.": "他把架子取下来了。",
    "Take down this note.": "把这个笔记下来。",
    "They took down the flag.": "他们把旗子降下来了。",
    # take over (assume control 接管)
    "Take over the business.": "接管生意。",
    "I took over the work.": "我接管了工作。",
    "She took over the meeting.": "她接管了会议。",
    "He took over my room.": "他占用了我的房间。",
    "Take over from me now.": "现在从我这里接过去。",
    "They took over the town.": "他们占领了城镇。",
    # take back (return 归还)
    "Take back the book.": "把书还回去。",
    "I took back what I said.": "我收回了我所说的话。",
    "She took the ring back.": "她把戒指拿回来了。",
    "He took back his offer.": "他收回了他的提议。",
    "Take this key back to the office.": "把这把钥匙拿回办公室。",
    "They took the animal back.": "他们把动物带回了。",
    # take away (remove 拿走)
    "Take away the plate.": "把盘子拿走。",
    "I took the food away.": "我把食物拿走了。",
    "She took the key away from him.": "她把钥匙从他那里拿走了。",
    "He took away my hope.": "他拿走了我的希望。",
    "Take the box away.": "把盒子拿走。",
    "They took the pain away.": "他们消除了疼痛。",
    # go in (enter 进去)
    "Go in through the door.": "从门进去。",
    "I went in the room.": "我进了房间。",
    "She went in the house.": "她进了房子。",
    "He is going in now.": "他现在正在进去。",
    "Go in and see.": "进去看看。",
    "They went in together.": "他们一起进去了。",
    "I went in the wrong way.": "我走错了路。",
    "She went in without a key.": "她没有钥匙就进去了。",
    "The key goes in the lock.": "钥匙插进锁里。",
    "Go in the other door.": "从另一个门进去。",
    # go out (exit 出去)
    "Go out of the room.": "从房间出去。",
    "I went out to the street.": "我走到了街上。",
    "She went out for a walk.": "她出去散步了。",
    "He goes out every night.": "他每晚都出去。",
    "Go out and get some air.": "出去透透气。",
    "They went out of the town.": "他们出了城。",
    "The light went out.": "灯灭了。",
    "I went out with a friend.": "我和朋友出去了。",
    "The fire went out.": "火灭了。",
    "She went out the back door.": "她从后门出去了。",
    # go on (continue 继续)
    "Go on with your work.": "继续你的工作。",
    "I went on reading.": "我继续阅读了。",
    "She went on with the story.": "她继续讲故事。",
    "He goes on talking.": "他继续说着。",
    "Go on, I am hearing you.": "继续，我在听。",
    "They went on with the journey.": "他们继续旅行。",
    "The meeting went on for hours.": "会议开了几个小时。",
    "Go on with what you were saying.": "继续你刚才说的。",
    "The war went on.": "战争继续。",
    "The train went on through the night.": "火车在夜间继续行驶。",
    # go off (depart 离开/响)
    "He went off to the station.": "他去车站了。",
    "I go off to work every morning.": "我每天早上都去上班。",
    "She went off without a word.": "她一句话没说就走了。",
    "The gun went off.": "枪响了。",
    "The light went off suddenly.": "灯突然灭了。",
    "Go off to bed now.": "现在去睡觉。",
    "The train goes off at six.": "火车六点开。",
    "The milk has gone off.": "牛奶坏了。",
    # go up (rise 上升)
    "Go up the street.": "沿着街走上去。",
    "I went up to the door.": "我走到门前。",
    "She went up the steps.": "她走上了台阶。",
    "The price went up.": "价格上涨了。",
    "Go up and see the room.": "上去看看房间。",
    "He went up in the lift.": "他乘电梯上去了。",
    "The sun goes up early.": "太阳升得早。",
    "Smoke went up from the fire.": "烟从火里升起来了。",
    # go down (descend 下降)
    "Go down the street.": "沿着街走下去。",
    "I went down to the station.": "我走到了车站。",
    "She went down the steps.": "她走下了台阶。",
    "The sun went down.": "太阳落下了。",
    "Go down and get the key.": "下去拿钥匙。",
    "The price went down.": "价格下降了。",
    "He went down on his knees.": "他跪了下来。",
    "The ship went down.": "船沉了。",
    # go back (return 回去)
    "Go back to your room.": "回你的房间。",
    "I went back home.": "我回了家。",
    "She went back to the store.": "她回到了商店。",
    "He went back to work.": "他回去工作了。",
    "We went back to the town.": "我们回到了镇上。",
    "They went back to their house.": "他们回到了自己的房子。",
    "I went back to my work.": "我回去工作了。",
    "Go back to your seat.": "回你的座位。",
    "She went back the next day.": "她第二天回去了。",
    # give up (surrender 放弃)
    "Give up the book.": "把书交出来。",
    "I gave up my room.": "我让出了我的房间。",
    "She gave up the work.": "她放弃了工作。",
    "He gave up his seat.": "他让出了座位。",
    "Give up smoking.": "戒烟。",
    "I gave up the fight.": "我放弃了战斗。",
    "She gave up her hope.": "她放弃了希望。",
    "He gave up his place.": "他让出了位置。",
    "Give up the key.": "交出钥匙。",
    "They gave up the search.": "他们停止了搜索。",
    # give out (distribute 分发)
    "Give out the books.": "分发书籍。",
    "I gave out the food.": "我分发了食物。",
    "She gave out the letters.": "她分发了信件。",
    "He gave out the papers.": "他分发了文件。",
    "Give out the work to the group.": "把工作分配给小组。",
    "They gave out the news.": "他们公布了消息。",
    "The teacher gave out the questions.": "老师分发了问题。",
    # give back (return 归还)
    "Give back the book.": "把书还回去。",
    "I gave back the key.": "我把钥匙还了。",
    "She gave back the money.": "她把钱还了。",
    "He gave back the letter.": "他把信还了。",
    "Give it back to me.": "把它还给我。",
    "They gave back the things.": "他们归还了东西。",
    # give away (donate 赠送)
    "Give away the book.": "把书送出去。",
    "I gave away my old clothes.": "我把旧衣服送出去了。",
    "She gave away her food.": "她送出了她的食物。",
    "He gave away his money.": "他把钱捐出去了。",
    "Give away the secret.": "泄露秘密。",
    "They gave away the news.": "他们传播了消息。",
    # get up (rise 起床)
    "Get up from your bed.": "从床上起来。",
    "I got up at six.": "我六点起床。",
    "She got up early.": "她起得早。",
    "He is getting up now.": "他正在起来。",
    "Get up and go.": "起来走吧。",
    "They got up together.": "他们一起起床。",
    "I got up from my seat.": "我从座位上站了起来。",
    "She got up to the door.": "她走到门前。",
    # get out (exit 出去)
    "Get out of the room.": "从房间出去。",
    "I got out of the house.": "我从房子里出来了。",
    "She got out of the car.": "她下了车。",
    "He got out of bed.": "他起了床。",
    "Get out and see the air.": "出去透透气。",
    "They got out of the town.": "他们出了城。",
    "I got out of the meeting.": "我离开了会议。",
    # get in (enter 进入)
    "Get in the car.": "上车。",
    "I got in the house.": "我进了房子。",
    "She got in the room.": "她进了房间。",
    "He got in the office.": "他进了办公室。",
    "Get in and be quick.": "进来快点。",
    "They got in together.": "他们一起进去了。",
    "I got in through the window.": "我从窗户进去了。",
    # get off (disembark 下车)
    "Get off the train.": "下火车。",
    "I got off the bus.": "我下了公交车。",
    "She got off the horse.": "她下了马。",
    "He got off the plane.": "他下了飞机。",
    "Get off at the next station.": "在下一站下车。",
    "They got off the ship.": "他们下了船。",
    "I got off at the wrong station.": "我在错误的站下了车。",
    # get on (board 上车)
    "Get on the bus.": "上公交车。",
    "I got on the train.": "我上了火车。",
    "She got on the plane.": "她上了飞机。",
    "He got on the horse.": "他上了马。",
    "Get on with your work.": "继续你的工作。",
    "They got on the ship.": "他们上了船。",
    "I got on with my friend.": "我和朋友相处。",
    # get back (return 取回)
    "Get back your money.": "取回你的钱。",
    "I got back my key.": "我拿回了我的钥匙。",
    "She got back the book.": "她拿回了书。",
    "He got back his seat.": "他拿回了座位。",
    "Get back to work.": "回去工作。",
    "They got back to the house.": "他们回到了房子。",
    "I got back my hope.": "我重拾了希望。",
    # keep on (persist 继续)
    "Keep on with the work.": "继续工作。",
    "I kept on reading.": "我继续阅读。",
    "She kept on going.": "她继续走路。",
    "He kept on talking.": "他继续说。",
    "Keep on, do not stop.": "继续，不要停。",
    "They kept on with the journey.": "他们继续旅行。",
    "I kept on till the end.": "我坚持到最后。",
    # keep up (maintain 保持)
    "Keep up the work.": "保持工作。",
    "I kept up my reading.": "我保持了阅读。",
    "She kept up her learning.": "她保持了学习。",
    "He kept up the house.": "他维护了房子。",
    "Keep up with them.": "跟上他们。",
    "They kept up the good work.": "他们保持了好的工作。",
    # keep off (avoid 避开)
    "Keep off the grass.": "不要踩草地。",
    "I kept off the road.": "我避开了路。",
    "She kept off the topic.": "她避开了话题。",
    "He kept off the drink.": "他戒了酒。",
    # keep out (exclude 不让进)
    "Keep out of the room.": "不要进房间。",
    "I kept out of the fight.": "我避开了打斗。",
    "She kept out of danger.": "她避开了危险。",
    "He kept out of the way.": "他避开了路。",
    # come in (enter 进来)
    "Come in through the door.": "从门进来。",
    "I came in the room.": "我进了房间。",
    "She came in the house.": "她进了房子。",
    "He came in the office.": "他进了办公室。",
    "Come in and see.": "进来看看。",
    "They came in together.": "他们一起进来了。",
    "I came in from the street.": "我从街上进来。",
    # come out (emerge 出来)
    "Come out of the room.": "从房间出来。",
    "I came out of the house.": "我从房子里出来。",
    "She came out of the office.": "她从办公室出来。",
    "He came out the door.": "他从门出来。",
    "Come out and see the sun.": "出来看看太阳。",
    "They came out of the car.": "他们从车里出来。",
    "I came out the back door.": "我从后门出来了。",
    # come back (return 回来)
    "Come back to the room.": "回房间。",
    "I came back home.": "我回了家。",
    "She came back to the store.": "她回到了商店。",
    "He came back to work.": "他回来工作了。",
    "Come back tomorrow.": "明天回来。",
    "They came back to the town.": "他们回到了镇上。",
    "I came back from the street.": "我从街上回来了。",
    # come from (来自)
    "I come from the country.": "我来自乡下。",
    "She comes from a small town.": "她来自一个小镇。",
    "He comes from the north.": "他来自北方。",
    "We come from different places.": "我们来自不同地方。",
    "They come from the same town.": "他们来自同一个镇。",
    "I come from a large family.": "我来自一个大家庭。",
    # let in (allow entry 放进)
    "Let me in.": "让我进去。",
    "Let the cat in.": "让猫进去。",
    "Let in the air.": "让空气进来。",
    "Let in some light.": "让光线进来。",
    # let go (release 放手)
    "Let go of the rope.": "放开绳子。",
    "I let go of the book.": "我放开了书。",
    "She let go of his hand.": "她放开了他的手。",
    "Let it go.": "放手吧。",
    # make up (reconcile 编造/和解)
    "Make up a story.": "编一个故事。",
    "I made up my mind.": "我下定了决心。",
    "She made up with her friend.": "她和朋友和好了。",
    "He made up the number.": "他编了号码。",
    "Make up the bed.": "把床整理好。",
    "They made up after the fight.": "打完后他们和好了。",
    # make out (decipher 辨认出)
    "Make out the word.": "辨认出这个词。",
    "I can make out the form.": "我能辨认出形状。",
    "She made out the letter.": "她辨认出了信。",
    "He made out a figure in the dark.": "他在黑暗中辨认出一个人影。",
    # send out (distribute 发出)
    "Send out the letters.": "发出信件。",
    "I sent out the books.": "我发出了书。",
    "She sent out the news.": "她发出了消息。",
    "He sent out a letter.": "他发出了一封信。",
    # send away (dismiss 打发走)
    "Send away the man.": "把那人打发走。",
    "I sent away the children.": "我送走了孩子。",
    "She sent him away.": "她把他送走了。",
    "He sent away the dog.": "他把狗赶走了。",
    # send for (summon 派人去叫)
    "Send for the doctor.": "派人去叫医生。",
    "I sent for help.": "我派人去求助。",
    "She sent for her friend.": "她派人去叫朋友。",
    "He sent for the police.": "他派人去叫警察。",
    # see through (discern 看穿)
    "See through the glass.": "透过玻璃看。",
    "I see through the wall.": "我看穿了墙。",
    "She sees through the lie.": "她看穿了谎言。",
    "He saw through the trick.": "他看穿了把戏。",
    "I see through you.": "我看穿了你。",
    # see about (attend to 处理)
    "See about the work.": "处理工作。",
    "I will see about it.": "我会处理的。",
    "She saw about the meal.": "她处理了饭的事。",
    "He saw about the ticket.": "他处理了票的事。",
    # see off (farewell 送别)
    "See off your friend.": "送别你的朋友。",
    "I saw him off at the station.": "我在车站送别了他。",
    "She saw off the family.": "她送别了家人。",
    "He saw me off at the door.": "他在门口送别了我。",
    # see to (attend to 照料)
    "See to the work.": "照料工作。",
    "I will see to it.": "我会照料的。",
    "She sees to the house.": "她照料房子。",
    "He sees to the children.": "他照料孩子。",
    # be in (be inside 在...里)
    "Be in the room.": "在房间里。",
    "I was in the house.": "我在房子里。",
    "She is in the office.": "她在办公室里。",
    "He is in the country.": "他在乡下。",
    # be out (be outside 在外)
    "Be out of the room.": "在房间外。",
    "I was out yesterday.": "我昨天在外面。",
    "She is out at the moment.": "她此刻在外面。",
    "He is out of the office.": "他不在办公室。",
    # be back (return 回来)
    "Be back tomorrow.": "明天回来。",
    "I was back at noon.": "我中午回来了。",
    "She will be back soon.": "她很快会回来。",
    "He is back from work.": "他下班回来了。",
    # be up (be awake/raised 醒着/上升)
    "Be up early.": "早点起来。",
    "I was up at six.": "我六点起来了。",
    "She is up now.": "她醒了。",
    "He is up the ladder.": "他在梯子上。",
    # be down (be depressed/low 情绪低落/低)
    "Be down in the mouth.": "心情不好。",
    "I was down after the news.": "听了消息后我情绪低落。",
    "She is down today.": "她今天情绪不好。",
    "The price is down.": "价格低了。",
    "He is down the street.": "他在街的另一头。",
}

print(f"Total translations: {len(TRANSLATIONS)}")

# 读取数据并添加中文
data_path = "/Users/cuijianchen/Projects/OgdenBasicEnglish/data/training-core.jsonl"
sentences = []
with open(data_path, "r") as f:
    for line in f:
        if line.strip():
            sentences.append(json.loads(line.strip()))

has_zh = sum(1 for s in sentences if s.get("zh"))
print(f"Before: {len(sentences)} sentences, {has_zh} have zh")

# 添加中文
added = 0
for s in sentences:
    if not s.get("zh") and s["sentence"] in TRANSLATIONS:
        s["zh"] = TRANSLATIONS[s["sentence"]]
        added += 1

print(f"Added {added} translations")

still_missing = sum(1 for s in sentences if not s.get("zh"))
print(f"Still missing zh: {still_missing}")

# 写文件
out_path = "/Users/cuijianchen/Projects/OgdenBasicEnglish/data/training-core.jsonl"
with open(out_path, "w") as f:
    for s in sentences:
        f.write(json.dumps(s, ensure_ascii=False) + "\n")
print(f"Written to {out_path}")

# 打印仍缺中文的句子
if still_missing > 0:
    print("\nStill missing zh:")
    for s in sentences:
        if not s.get("zh"):
            print(f"  [{s.get('step')}] {s['sentence']}")
