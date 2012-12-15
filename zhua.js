var request= require("request");
var source=__dirname+"/source.txt";
var fs= require("fs");
var arr=fs.readFileSync(source,"utf-8").split("\n")
arr.forEach(function(v,i){
  var cache=v.replace(/ */g,"")
  if(cache.length<5||cache.length>20){
    arr[i]=null
  }else if(!/[\u4e00-\u9fa5]+?[\u3002\uff0c\uFF1F\uFF01]/.test(cache)){
    arr[i]=null
  }else{
    arr[i]=cache
  }
})
var result=[];
arr.forEach(function(v){
  if(!v) return;
  var c=v.split(/[\u3002\uff0c\uFF1F\uFF01]/)
  c.forEach(function(vc){
    if(!!vc){
      result.push(vc)
    }
  })
})
console.log(result)