module.exports = function(bot){
  return {
    "run": function(msg, user, bot){return "echo " + this.param(msg);},
  };
};
