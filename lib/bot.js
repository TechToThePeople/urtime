
var _ = require('underscore')
  , commandsJs = require('./commands.js')

var defaultBotSettings = {
  name: 'HAL 9000',
  commandGroups: ['main','test','timetrack'],
  partial: function (msg) { // send partial results to the calling party
    console.log (msg);
  },
  final: function (msg) { // it is the last information, command completely exectuted
    if (msg) {
      console.log (msg);
    }
  }
}

function Bot (settings) {
  this.settings = _.extend(result, defaultBotSettings, settings);
  var commands = commandsJs.all(this.settings.commandGroups)

  function result (type, data) { //this should be defined by the server using this bot
    console.log (type);
    console.log (data);
  }

  this.run = function (msg, user,callback){
    console.log ("cmd to run: " + msg);

    // ask each contextual command if it wants to process the message
    var command = _.find(user.contextualCommands, function(command) {
      return command.trigger(msg,user);
    });

    if (!command) {
      // ask each command if it wants to process the message
      command = _.find(commands, function(command) {
        return command.trigger(msg,user);
      });
    } 
    if (command) {
      user.lastcmd = command;
    } else {
      command = commandsJs.default();
    }
    return command.run(msg, user, function (type, data) {
      callback && callback (type, data);
    });
  };
}


exports.Bot = Bot
// legacy
exports.bot = Bot
