var name = "start";
var _ = require('underscore');

var trigger= function(msg, user) {
  return name == msg || msg.indexOf(name + " ") == 0;
} 

function run (msg, user,callback) {
  var taskList = user.getTaskList();

  var m = msg.match(/^start (\!|)(.*)$/) // refactoring-> mv to this.param(msg) ?? 
  if (m) {
      var comment = null
      , commentMsg = ''
      , force = (m[1] ? true : false)
      , task = m[2]
      , mm = m[2].match(/^(.+),(.*)$/)
    if (mm) {
      task = mm[1]
      comment = mm[2]
      commentMsg = "\nNote: '" + comment + "'"
    }
    if (!isNaN(task)) { 
      return startNumber(task,user,callback);
    }
    if (taskList.taskExists(task)) {
      user.start(task, comment)
      return "start task: '" + task + "'" + commentMsg;
    }
    else if (force && taskList.addTask(task)) {
      user.start(task, comment)
      return "start *new* task: '" + task + "'" + commentMsg;
    }
    else if (force) {
      return "Failed to create task '" + task + "'."
    }
    else {
      user.addContextual (require("./start.yes.js")(task));
      _.delay(function(){
        callback("question","Yes or No?");
      }, 500);
      return callback ("partial", {
        text: "Task '" + task + "' does not exist, Would you like to create it?"
      });
    }
  }
  else {
    var tasks = taskList.getActiveTasks()
    if (tasks.length) {
      var rows = []
      for (var i = 0; i < tasks.length; ++i) {
        rows.push('\n' + i + '. ' + tasks[i])
      }
      callback ("partial", {
        text: "On your todo: "+rows.join(''),
        tasks: tasks
      });
      _.delay(function(){
        callback("question","Type the number (between 0 and "+ (tasks.length -1) +") of the task you want to start");
      }, 1500);
    }
      user.addContextual (require("./start.number.js")(task));
  }
}
/*

*/
module.exports = function () {
  return {
    name:name,
    trigger:trigger,
    run:run
  };
};
