
function punchout(msg, user) {
  var interval = user.stop()
  if (interval) {
    return "Time tracking stopped. Duration: " + interval.duration
  }
  else {
    return "No task to punchout from."
  }
}

module.exports = function(bot) {return {run: punchout}}
