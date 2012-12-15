mongoose = require("mongoose")
module.exports = {}
module.exports.connectDb = (cb) ->
  mongoose.connect "mongodb://localhost/kuihuabaodian-db", cb
vs = new mongoose.Schema
  content:
    type: String

  order:
    type: Number
    index: true
    unique: true

  count:
    type: Number
    default: 0
guide='一个字的词找到诗句的概率更高'
taunts=[
  '少年，诗词中没有这么猥琐的词~'
  '不要急不要急，心急吃不了热豆腐'
  '( ⊙ o ⊙ )！'
  'O(∩_∩)O~呵呵'
  '世界上的一切问题，都能用“关你屁事”和“关我屁事” 来回答。突然感觉屁好忙。'
  '把大象放进冰箱要几步？',
  '找不到诗句怎么办？先祝您剩蛋节快乐吧~~~',
  '想不到合适的词？看看天气吧，雨，飘雪，秋风，落叶，归草。也许，这就是人生吧。'
  guide
  guide
  guide
  guide
  guide
  guide
]
vs.statics.getReply=(words,cb)->
  query=@where('content')
  for word in words
    query=query.regex(new RegExp(word));
  await query.sort({'count':-1}).exec defer err,items
  for item in items
    item.count++
    await item.save defer err
  if items.length==0
    return cb err,taunts[Math.floor(Math.random()*taunts.length)]
  await @find({order:{$gte:items[0].order-2,$lte:items[0].order+2}}).sort({'order':1}).exec defer err,items
  str=''
  for item in items
    str+=item.content
    str+=','
  cb(err,str)

verse= mongoose.model "verse", vs
module.exports.verse =verse