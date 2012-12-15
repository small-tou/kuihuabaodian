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
vs.statics.getReply=(words,cb)->
  query=@where('content')
  for word in words
    query=query.regex(new RegExp(word));
  await query.sort({'count':-1}).exec defer err,items
  for item in items
    item.count++
    await item.save defer err
  if items.length==0
    return cb err,items
  await @find({order:{$gte:items[0].order-2,$lte:items[0].order+2}}).sort({'order':1}).exec defer err,items
  cb(err,items)

verse= mongoose.model "verse", vs
module.exports.verse =verse