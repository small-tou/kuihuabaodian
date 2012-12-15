var request= require("request");
var source=__dirname+"/source.txt";
var fs= require("fs");
var arr=fs.readFileSync(source,"utf-8").split("\n")
require('iced-coffee-script');
var models=require('./models');

models.connectDb(function(){
  models.verse.remove({},function(err){
    arr.forEach(function(v,i){
      var cache=v.replace(/ */g,"")
      if(cache.length>20){
        arr[i]=null
      }else if(!/[\u4e00-\u9fa5]+?[\u3002\uff0c\uFF1F\uFF01]/.test(cache)){
        arr[i]=null
      }else{
        arr[i]=cache
      }
    });
    var result=[];
    var counter=0;
    arr.forEach(function(v,i){
      if(!v) return;
      var c=v.split(/[\u3002\uff0c\uFF1F\uFF01]/)//拆开
      c.forEach(function(vc){
        if(!!vc){
          if(!/[\uFF08\uFF09\-\(\)\:\uFF1A]/.test(vc)&&vc.length>2){//特殊字符黑名
            if(i%100==0){
              console.log((i*100/arr.length).toFixed(2)+'%');
            }
            (new models.verse({content:vc,order:counter++})).save(function(err){
              if(err){
                console.err(err);
              }
            });
          }
        }
      });
    });
  });
});