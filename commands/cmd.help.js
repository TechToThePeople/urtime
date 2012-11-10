var _ = require ('underscore');
module.exports = function(bot){
  return {
    "run": function(msg, user, bot){
      var reply= "known commands: ";
      _.each(bot.cmd, function (cmd) { reply = reply + cmd.name + ", "; });
      return reply;
    },
  };
};
