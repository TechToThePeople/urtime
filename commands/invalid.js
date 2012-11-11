function run(msg, user) {
  return user.name + "... I'm afraid I can't let you do that." +
    " \nInvalid command '" + msg + "'"
}

module.exports = function(bot){return {name: 'invalid', run: run}}
