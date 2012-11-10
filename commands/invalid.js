module.exports = function(bot){
  return {
    "name": "invalid",
    "run": function(msg, user){ return "I'm sorry "+ user.name+", invalid command '"+msg+"'. I'm afraid I can't do that";},
  };
};
