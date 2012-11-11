
var _ = require('underscore')
  , commandsJs = require('commands.js')

var defaultBotSettings = {
  name: 'miss moneypenny'
}

function Bot (settings) {

  this.settings = {};
  this.cmd = commandsJs.collectCommands();
  _.extend(this.settings, defaultBotSettings, settings);

  this.run = function (msg, user){
    console.log ("asked " + msg);

    // Find the command where the trigger returns true.
    var command = _.find(this.cmd, function(cmd) {
      return cmd.trigger(msg);
    });

    // Fallback: "invalid" command.
    if (typeof command == "undefined") {
      command = invalid
    }

    // Execute the chosen command
    return command.run(msg, user);
  }
}


exports.Bot = Bot
// legacy
exports.bot = Bot
