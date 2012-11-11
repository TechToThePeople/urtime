

function addtask(msg, user) {
  var task = this.param(msg);
  if (task) {
    var taskList = user.getTaskList();
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
    return "Syntax: 'add task {task name}'"
  }
}

module.exports = function(bot) {return {name:"add task", run: addtask}}
