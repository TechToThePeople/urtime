module.exports = function(bot){
  return {
    "run": function(msg, user){return "say " + this.param(msg);},
  };
};
