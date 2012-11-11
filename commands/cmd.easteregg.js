function run(msg, user, callback) {
  var _ = require('underscore');
  callback ("partial",{type:"error",text:"I'm sorry, Dave. I'm afraid I can't do that."});
  _.delay(function(){
    callback("partial","I think you know what the problem is just as well as I do");
  }, 1500);
  _.delay(function(){
    callback("partial","This mission is too important for me to allow you to jeopardize it.");
  }, 4000);
  _.delay(function(){
    callback("final","I know that you and Frank were planning to disconnect me, and I'm afraid that's something I cannot allow to happen.");
  }, 10000);
}

module.exports = function(bot){return {name: 'easter egg', run: run}}
