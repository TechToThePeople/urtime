var commandsJs = require('../lib/commands.js')

function help(msg, user) {
  return commandsJs.getCommandsHelp()
}

module.exports = function(bot) {return {run: help}}
