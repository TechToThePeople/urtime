
var momentJs = require('moment')


function run(msg, user, callback) {
  text = user.getTimesheet().getAsText()
  if (text) {
    return "Tracked time:\n" + text
  }
  else {
    return "Nothing tracked so far."
  }
}

module.exports = function(bot) {return {run: run}}
