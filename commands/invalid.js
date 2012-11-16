var command = require('../lib/commands.js')


function run(msg, user, callback) {
  setTimeout(function(){
    callback('message', command.help().run(msg,user,callback))
  }, 600)
  callback ('error', user.firstname + "... I'm afraid I can't let you do that." +
    " \nInvalid command '" + msg + "'")
}


module.exports = function(bot){return {name: 'invalid', run: run}}
