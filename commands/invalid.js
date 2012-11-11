module.exports = function(bot){
  return {
    "name": "invalid",
    "run": function(msg, user){ return user.name+"... I'm afraid I can't let you do that. "+"\nInvalid command '"+msg +"'";},
  };
};
