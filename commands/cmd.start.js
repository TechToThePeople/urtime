function run (msg, user) {
  var m = msg.match(/^start (\!|)(.*)$/)
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
    if (!isNaN(task)) {
      var taskId = 1 * task
      task = taskList.taskById(taskId)
      if (!task) {
        return "There is no task with id " + taskId + ".\n" +
          "Use 'todo' to show existing tasks, or 'add task' to create new ones."
      }
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
        "You can force its creation with 'start !" + task + "',\n" +
        "or with 'addtask " + task + "'"
    }
  }
  else {
    return "Syntax: 'start <task name>[, <comment>]'"
  }
}

module.exports = function(bot) {return {run: run}}

