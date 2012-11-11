
// Yes, it is difficult to find package names that are not ambiguous with object
// names. AND IT DOESN'T MATTER!!!! (XD)

var taskJs = require('./task.js')
var timesheetJs = require('./timesheet.js')
var users = {};


/**
 * Check if a user exists in the users array
 */
function exists (name) {
  return (typeof users[name] !=  "undefined");
}

/**
 * Connect user with bot (?)
 */
function connect (name, bot) {
  if (exists(users,name)) {
    return false;
  } 
  console.log('connect user: ' + name)
  users[name] = new User(name, bot);
  return true;
}

/**
 * Create a user
 */
function add(name, bot) {
  return new User(name, bot)
}

/**
 * Get a user by name.
 * This will create the user, if it does not exist yet.
 */
function getUser(username, bot) {
  if (!users[username]) {
    connect(username, bot)
  }
  return users[username]
}

/**
 * Get the current time.
 * This function is not exported.
 */
function now() {
  return (new Date()).getTime()
}

function User(name, bot) {

  var taskList
    , timesheet
    , currentTask
    , currentTaskSince
    , currentTaskComment

  // These attributes are public
  this.lastcmd = null;  // last command run from the bot
  this.name = name;

  /**
   * Private method to get the timesheet
   */
  function getTimesheet() {
    if (!timesheet) {
      timesheet = timesheetJs.createForUsername(name)
    }
    return timesheet
  }

  /**
   * Private method to stop the time tracking for the current task.
   */
  function stop(endTime) {
    var result = getTimesheet().addInterval(currentTaskSince, endTime, currentTask, currentTaskComment)
    currentTask = null
    currentTaskSince = null
    currentTaskComment = null
    return result
  }

  /**
   * Start a new task.
   *
   * @param string task
   *   String identifier of the task
   * @param comment
   *   Optional comment
   */
  this.start = function (task, comment) {
    var time = now()
    if (currentTask) {
      // Stop the running task first
      stop(time)
    }
    if (task) {
      // Start the new task
      currentTask = task
      currentTaskComment = comment || null
      currentTaskSince = time
    }
  }

  /**
   * Stop the running task
   */
  this.stop = function () {
    if (!currentTask) {
      console.log('no current task')
      return false;
    }
    console.log('current task: ', currentTask)
    return stop(now())
  }

  /**
   * Get the user's task list.
   *
   * @return
   *   An object that knows if a task exist, and that can create new tasks.
   */
  this.getTaskList = function() {
    if (!taskList) {
      taskList = taskJs.createForUsername(name)
    }
    return taskList
  }
}

User.add = add
User.connect = connect
User.exists = exists
User.users = users
exports.User = User

// Ok, the above User.* is stupid. Let's add it back to exports
// (but keep the above, so we don't break anything)
exports.add = add
exports.connect = connect
exports.exists = exists
exports.users = users
exports.getUser = getUser

// To disambiguate with user objects, the module can be included as e.g.
// var userJs = require('./user.js')

