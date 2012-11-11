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

  var activeTasks = jsonReadFileSync(filename, ["procrastination"]);

  function save() {
    fs.writeFileSync(filename, JSON.stringify(activeTasks), 'utf-8')
  }

  /**
   * Create a task with the given name, if it not already exists.
   */
  this.addTask = function(name) {

    //TODO: fix the race condition with readFile (if trying to add before)

    if (activeTasks.indexOf(name) !== -1) {
      // This task is already in the list of active tasks
      return this.activeTasks.indexOf(name);
    }

    var pos = activeTasks.push(name) - 1;
    save()

    return pos;
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
}


/**
 * Create the task list for a given username.
 */
function createForUsername(username) {

  // TODO: Sanitize username
  var filename = 'data/task/' + username + '.json'
  return new UserTaskList(filename)
}


exports.createForUsername = createForUsername
