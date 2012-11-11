
function todo(msg, user) {
  var tasks = user.getTaskList().getActiveTasks()
  if (tasks.length) {
    var rows = []
    for (var i = 0; i < tasks.length; ++i) {
      rows.push('\n' + (i+1) + '. ' + tasks[i])
    }
    return "Active tasks:" + rows.join('')
  }
}

module.exports = function(bot){return {run: todo}}
