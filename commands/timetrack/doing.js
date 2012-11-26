
var momentJs = require('moment')

function run (msg, user, callback) {
  var durationString = user.doing().humanize()
  return "Time tracking stopped. Duration: " + durationString
}

module.exports = function(bot) {return {contextual:true,run: run}}
