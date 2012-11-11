
var momentJs = require('moment')


function stop(msg, user) {
  var interval = user.stop()
  if (interval) {
    var durationString = momentJs.duration(interval.duration).humanize()
    return "Time tracking stopped. Duration: " + durationString
  }
  else {
    return "No task to stop from."
  }
}

module.exports = function(bot) {return {run: stop}}
