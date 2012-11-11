

function addtask(msg, user) {
  var m = msg.match(/^addtask (.*)$/)
  if (m) {
    var taskList = user.getTaskList()
      , task = m[1]
    if (taskList.taskExists(task)) {
      return "The task: '" + task + "' already exists."
    }
    else if (taskList.addTask(task)) {
      return "Created new task '" + task + "'."
    }
    else {
      return "Unable to create task '" + task + "'."
    }
  }
  else {
    return "Syntax: 'addtask <task name>'"
  }
}

module.exports = function(bot) {return {run: addtask}}

