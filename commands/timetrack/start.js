var name = "start";
var _ = require('underscore');

var trigger= function(msg, user) {
  if ( user.lastcmd && (user.lastcmd.name == name) && !isNaN(parseFloat(msg)) && isFinite(msg) ) {
    return true; //it's the number of a task (dialog mode)
  }
//TODO: deal with yes/no on create task
  return name == msg || msg.indexOf(name + " ") == 0;
} 

function run (msg, user,callback) {
  var taskList = user.getTaskList();

  if (!isNaN(parseFloat(msg)) && isFinite(msg) ) { // dialog, it's the number of a task
    return startNumber(msg,user,callback);
  }

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
      _.delay(function(){
        callback("question","Yes or No?");
      }, 1000);
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
//    callback("final",)
//    return "Syntax: 'start {task name}[, comment]'"
  }

  function startNumber (task, user,callback) {
    var taskId = 1 * task
    task = taskList.taskById(taskId)

    if (task) {
      callback ("success", {
        text: "starting "+task +"\nType 'stop {description of the work you did} when finished'"
      });
      return;
    } 

    if (!task) {
      var rows = []
      for (var i = 0; i < taskList.getActiveTasks().length; ++i) {
        rows.push('\n' + i + '. ' + taskList.getActiveTasks()[i])
      }
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
