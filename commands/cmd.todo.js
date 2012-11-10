
module.exports = function(bot){
  return {
    "run": function(msg, user){
      var tasks=require ("../lib/task.js").tasks(user,function (size) {
        console.log (size +" in todo");
        console.log (tasks.actives);
//        tasks.add ("write doc");
        
      });
console.log (tasks);
      return " in todo";
    },
  };
};
