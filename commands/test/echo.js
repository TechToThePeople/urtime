function run(msg, user) {
  // 'this' is the bot.
  // this.param gets the part of the message after the 'echo '.
  return 'say ' + this.param(msg)
}

module.exports = function(bot){return {run: run}}
