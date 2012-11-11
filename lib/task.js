var fs = require ('fs')

function jsonReadFileSync(filename, fallback) {
  try {
    var fileContents = fs.readFileSync(filename, 'utf-8')
    return JSON.parse(fileContents) || fallback
  }
  catch (e) {
    return fallback
  }
}


function UserTaskList(filename) {

  var activeTasks = jsonReadFileSync(filename, ["procrastination","evaluate this project-urt.im","VOTE FOR US"]);

  function save() {
    fs.writeFile(filename, JSON.stringify(activeTasks), 'utf-8', function(err){
      if (err) throw err
      console.log('Task list saved to "' + filename + '".')
    })
  }

  /**
   * Create a task with the given name, if it not already exists.
   */
  this.addTask = function(name) {

    //TODO: fix the race condition with readFile (if trying to add before)

    if (activeTasks.indexOf(name) !== -1) {
      // This task is already in the list of active tasks
      return activeTasks.indexOf(name);
    }

    var pos = activeTasks.push(name) - 1;
    save()

    return pos;
  }

  this.taskById = function(taskId) {
    return activeTasks[taskId] || null
  }

  /**
   * Check if a task exists
   */
  this.taskExists = function(name) {
    return activeTasks.indexOf(name) !== -1
  }

  /**
   * Count the number of active tasks
   */
  this.countActiveTasks = function() {
    return activeTasks.length
  }

  this.getActiveTasks = function() {
    // We only return a copy, so the consumer cannot mess with the tasks.
    // TODO: There must be a more efficient way to do this.
    var copy = []
    for (var i = 0; i < activeTasks.length; ++i) {
      copy[i] = activeTasks[i]
    }
    return copy
  }
}


/**
 * Create the task list for a given username.
 */
function createForUsername(username) {

  var filename = username.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  filename = 'data/task/' + filename + '.json'
  return new UserTaskList(filename)
}


exports.createForUsername = createForUsername
