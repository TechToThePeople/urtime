function run(msg, user, callback) {
  var _ = require('underscore');
  callback ("partial",{type:"error",text:"I'm sorry, Dave. I'm afraid I can't do that."});
  _.delay(function(){
    callback("final","This mission is too important for me to allow you to jeopardize it.");
  }, 1000);
}

module.exports = function(bot){return {name: 'easter egg', run: run}}
