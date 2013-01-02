
// Yes, it is difficult to find package names that are not ambiguous with object
// names. AND IT DOESN'T MATTER!!!! (XD)

var sys = require('sys')
  , EventEmitter = require('events').EventEmitter
  , taskJs = require('./task.js')
  , _ = require('underscore')
  , timesheetJs = require('./timesheet.js')
  , users = {};


/**
 * Check if a user exists in the users array
 */
function exists (name) {
  return (typeof users[name] !=  "undefined");
}

/**
 * Connect user with bot (?)
 */
function connect (name, onUserConnect) {
  if (exists(name)) {
    return false;
  }
  console.log('connect user: ' + name)
  users[name] = new User(name, {});
  if (typeof onUserConnect == 'function') {
    onUserConnect('Affirmative, Dave. I read you.\nStarting task "procrastination"', users[name])
    users[name].getTaskList().addTask('procrastination')
    users[name].start('procrastination')
  }
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
function getUser(username, onUserConnect) {
  if (!users[username]) {
    connect(username, onUserConnect)
  }
  return users[username]
}

function guessFirstname(name) {
  var firstname = name.split(/[^a-z0-9]/gi)[0]
  return firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase()
}

/**
 * Get the current time.
 * This function is not exported.
 */
function now() {
  return (new Date()).getTime()
}

function User(name, bot) {

  EventEmitter.call(this)

  var self = this

  var taskList
    , timesheet
    , currentTask
    , currentTaskSince
    , currentTaskComment

  // These attributes are public
  this.lastcmd = null;  // last command run from the bot
  this.contextualCommands = [];
  this.name = name;
  this.firstname = guessFirstname(name)


  this.removeContextual = function (command) {
    this.contextualCommands = _(this.contextualCommands).reject(function(el) { 
      return el.mame === command.name; 
    });
  }

  this.addContextual = function (command,clear) {
    prepareCommand = require ("./commands.js").prepare;
    prepareCommand(false,command);
    clear = clear || true;
    if (clear)
      this.contextualCommands = [];
    this.contextualCommands.push (command);
  }
 
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
    // currentTask = null
    currentTaskSince = null
    currentTaskComment = null
    self.emit('stop', endTime)
    return result
  }


  this.doing = function () {
    return {duration: now() - currentTaskSince, task:currentTask};
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
    if (currentTaskSince) {
      // Stop the running task first
      stop(time)
    }
    if (task) {
      // Start the new task
      currentTask = task
      currentTaskComment = comment || null
      currentTaskSince = time
      self.emit('start', time, currentTask)
    }
  }

  this.resume = function(comment) {
    if (!currentTask) {
      // Forgot what we last did. Cannot resume.
      return false
    }
    else if (currentTaskSince) {
      // Current task is still running.
      return true
    }
    else {
      var time = now()
      currentTaskComment = comment || "(resume)"
      currentTaskSince = time
      self.emit('start', time, currentTask)
      return currentTask
    }
  }

  /**
   * Stop the running task
   */
  this.stop = function () {
    if (!currentTaskSince) {
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

  this.getTimesheet = function() {
    return getTimesheet()
  }

  // Force creating timesheet and tasklist,
  // to make all errors show up immediately.
  this.getTaskList()
  this.getTimesheet()
}

sys.inherits(User, EventEmitter)

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

