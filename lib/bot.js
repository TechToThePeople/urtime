
var _ = require('underscore')
  , commandsJs = require('./commands.js')

var defaultBotSettings = {
  name: 'miss moneypenny'
}

function processSettings(settings) {
  var result = {}
  _.extend(result, defaultBotSettings, settings)
  return result
}

function Bot (settings) {

  var invalid = commandsJs.getInvalidCommand()
  var commands = commandsJs.collectCommands()

  // TODO: Why do we need this public?
  this.cmd = commands
  this.invalid = invalid

  this.settings = processSettings(settings);

  function findCommand(msg) {

    // Find the command where the trigger returns true.
    var command = _.find(commands, function(command) {
      return command.trigger(msg);
    });

    // Fallback: "invalid" command.
    return command || invalid
  }

  this.run = function (msg, user){
    console.log ("asked " + msg);

    // Find the command
    var command = findCommand(msg)

    // Execute the chosen command
    return command.run(msg, user);
  }
}


exports.Bot = Bot
// legacy
exports.bot = Bot
