var name = "start";
var _ = require('underscore');

var trigger= function(msg, user) {
  if ( user.lastcmd && (user.lastcmd.name == name) && !isNaN(parseFloat(msg)) && isFinite(msg) ) {
    return true; //it's the number of a task (dialog mode)
  }
  return name == msg || msg.indexOf(name + " ") == 0;
} 

function run (msg, user,callback) {
  var taskList = user.getTaskList();

  if (!isNaN(parseFloat(msg)) && isFinite(msg) ) {
    startNumber(task,user,callback);
  }

  var m = msg.match(/^start (\!|)(.*)$/)
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
      startNumber(task,user,callback);
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
      return "Task '" + task + "' does not exist.\n" +
        "Would you like to create it?\n Yes or No?"
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
//    callback("final",)
//    return "Syntax: 'start {task name}[, comment]'"
  }

  function startNumber (task, user,callback) {
    var taskId = 1 * task
    task = taskList.taskById(taskId)
    var rows = []
    for (var i = 0; i < taskList.getActiveTasks().length; ++i) {
      rows.push('\n' + i + '. ' + taskList.getActiveTasks()[i])
    }
    if (!task) {
      callback ("error", {
        text: "There is no task number " + taskId + ".\n" +
        "Use 'add task' to create a new one or choose among your tasks",
      });
      _.delay(function(){
        callback ("partial", {
          text: "On your todo: "+rows.join(''),
          tasks: taskList.getActiveTasks()
        });
      }, 1000);

      _.delay(function(){
        callback("question","Which one do you want to start? (number between 0 and "+ (taskList.getActiveTasks().length -1));
      }, 1500);
      return;
  }
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
