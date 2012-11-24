
function todo(msg, user, callback) {
  var tasks = user.getTaskList().getActiveTasks()
  if (tasks.length) {
    var rows = []
    for (var i = 0; i < tasks.length; ++i) {
      rows.push('\n' + i + '. ' + tasks[i])
    }
    callback ("success", {
      text: "On your todo: "+rows.join(''),
      tasks: tasks
    });
  }
}

module.exports = function(bot){return {run: todo}}
