var express = require('express');
var cons = require('consolidate');
var Client = require('mysql').Client;
var xml = require("node-xml-lite");
var XML = require('xml');
var Taobao = require("./taobao.js");
var formatjson = require('formatjson');
var sql_username="root"
var sql_pwd="123" 
//init express app
var app = express();
app.use(express.logger({
  format: ':method :url :status'
}));
//设置文件上传临时文件夹
app.use(express.bodyParser({
  uploadDir:'./uploads'
}));
app.use(express.cookieParser());
app.use(express.session({
  secret: 'yutou'
}));
app.use(app.router);
app.use(express.errorHandler({
  dumpExceptions: true, 
  showStack: true
}));
app.error=function(err, req, res){
  console.log("500:" + err + " file:" + req.url)
  res.render('500');
}
//设置模板引擎为mustache，这里使用了consolidate库
app.engine("html", cons.mustache);
//设置模板路径
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('view options', {
  layout: false
}) 
app.get("/",function(req,res){
  res.render("index.html")
})
//首页代码
app.get('/api', function(req, res){
  var checkstr=req.query.echostr;
  if(checkstr){
    res.end(checkstr);
  }else{
  }
});
app.post("/api",function(req,res){
  var chunks=[];
  var size=0;
  req.on("data",function (chunk) {
    chunks.push(chunk);
    size += chunk.length;
  })
  req.on("end",function () {
    switch (chunks.length) {
      case 0:
        data = new Buffer(0);
        break;
      case 1:
        data = chunks[0];
        break;
      default:
        data = new Buffer(size);
        for (var i = 0, pos = 0, l = chunks.length; i < l; i++) {
          chunks[i].copy(data, pos);
          pos += chunks[i].length;
        }
        break;
    }
    data=data.toString();
    var xmlData=xml.parseString(data)
    var options=xmlData.childs
    var msg={
      ToUserName: '',
      FromUserName: '',
      CreateTime: '',
      MsgType: '',
      Content: '',
      FuncFlag:0
    }
    options.forEach(function(d){
      msg[d.name]=d.childs[0]
    })
    var config={
      ToUserName: {
        _cdata:msg.FromUserName
      },
      FromUserName: {
        _cdata:msg.ToUserName
      },
      CreateTime: msg.CreateTime,
      MsgType: {
        _cdata:'news'
      },
      Content: {
        _cdata:"hehe"
      },
      FuncFlag:0,
      ArticleCount:0,
      Articles:[
                
    ]
    }
    result=XML([{
      "xml":result
    }])
    res.end(result)
  })
    
})
app.listen(8333);
process.on('uncaughtException', function (error) {
  console.log(error)
});
         