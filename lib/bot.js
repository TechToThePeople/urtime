
var _ = require('underscore')
  , commandsJs = require('./commands.js')

var defaultBotSettings = {
  name: 'HAL 9000',
  partial: function (msg) { // send partial results to the calling party
    console.log (msg);
  },
  final: function (msg) { // it is the last information, command completely exectuted
    if (msg) {
      console.log (msg);
    }
  }
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

  function result (type, data) {
    console.log (type);
    console.log (data);
  }

  this.run = function (msg, user,callback){
    console.log ("cmd to run: " + msg);

    // ask each command if it wants to process the message
    var command = _.find(commands, function(command) {
      return command.trigger(msg);
    });

    if (command) {
      user.lastcmd = command;
    } else {
      command = invalid;
    }
    return command;
  }

  return command.run(msg, user, function (type, data) {
    callback && callback (type, data);
  });
}


exports.Bot = Bot
// legacy
exports.bot = Bot
