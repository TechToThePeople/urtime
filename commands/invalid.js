var commandsJs = require('../lib/commands.js')


function run(msg, user, say) {
  setTimeout(function(){
    say('message', commandsJs.getCommandsHelp())
  }, 600)
  say('message', user.firstname + "... I'm afraid I can't let you do that." +
    " \nInvalid command '" + msg + "'")
}


module.exports = function(bot){return {name: 'invalid', run: run}}
