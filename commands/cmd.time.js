module.exports = function(bot){
  return {
    "run": function(msg, user){
      var date =  new Date();
      return date.toLocaleString();
    },
  };
};
