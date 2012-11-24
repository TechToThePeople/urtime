
var momentJs = require('moment')


function run(msg, user, callback) {
  text = user.getTimesheet().getAsText()
  if (text) {
    callback('success', {
      text: "Tracked time:\n" + text,
      tree: user.getTimesheet().getAsTree()
    })
  }
  else {
    callback('success', {
      text: "Nothing tracked so far.",
      tree: null
    })
  }
}

module.exports = function(bot) {return {run: run}}
