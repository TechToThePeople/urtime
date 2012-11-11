
var momentJs = require('moment')


function punchout(msg, user) {
  var interval = user.stop()
  if (interval) {
    var durationString = momentJs.duration(interval.duration).humanize()
    return "Time tracking stopped. Duration: " + durationString
  }
  else {
    return "No task to punchout from."
  }
}

module.exports = function(bot) {return {run: punchout}}
