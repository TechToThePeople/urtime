

function punchin(msg, user) {
  var m = msg.match(/^punchin (\!|)(.*)$/)
  if (m) {
    var taskList = user.getTaskList()
      , comment = null
      , commentMsg = ''
      , force = (m[1] ? true : false)
      , task = m[2]
      , mm = m[2].match(/^(.+),(.*)$/)
    if (mm) {
      task = mm[1]
      comment = mm[2]
      commentMsg = "\nNote: '" + comment + "'"
    }
    if (taskList.taskExists(task)) {
      user.start(task, comment)
      return "punchin task: '" + task + "'" + commentMsg;
    }
    else if (force && taskList.addTask(task)) {
      user.start(task, comment)
      return "punchin *new* task: '" + task + "'" + commentMsg;
    }
    else if (force) {
      return "Failed to create task '" + task + "'."
    }
    else {
      return "Task '" + task + "' does not exist.\n" +
        "You can force its creation with 'punchin !" + task + "',\n" +
        "or with 'addtask " + task + "'"
    }
  }
  else {
    return "Syntax: 'punchin <task name>[, <comment>]'"
  }
}

module.exports = function(bot) {return {run: punchin}}

