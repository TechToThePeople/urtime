

function addtask(msg, user) {
  var m = msg.match(/^addtask (.*)$/)
  if (m) {
    var taskList = tasks.getForUsername(user.name)
      , task = m[1]
    if (taskList.taskExists(task)) {
      return "The task: '" + task + "' already exists."
    }
    else if (taskList.addTask(task)) {
      user.start(task, comment)
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

