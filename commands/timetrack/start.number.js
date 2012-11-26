var trigger= function(msg, user) {
  return !isNaN(parseFloat(msg)) && isFinite(msg);
} 

function run (task, user,callback) {
  var taskList = user.getTaskList();
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
console.log ("create task " + this.task);
user.start(this.task);
user.removeContextual(this);
callback ("success", {
  text: "Working on "+this.task
});
}

module.exports = function(task) {return {task:task, trigger:trigger, contextual:true, name:"number create task", run: run}}

