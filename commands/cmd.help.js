var commandsJs = require('../lib/commands.js')

function run (msg, user,callback) {
  commands = commandsJs.all();
  var names = []
  for (var i = 0; i < commands.length; ++i) {
    names.push(commands[i].name)
  }
  return "Known commands: " + names.join(', ')
}
module.exports = function(bot) {return {run: run}}
