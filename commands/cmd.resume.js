
function run(msg, user) {
  var task = user.resume()
  if (!task) {
    return "We are sorry, but we don't remember what you last did. Can't resume."
  }
  else if (task === true) {
    return "Already tracking."
  }
  else {
    return "Resuming task '" + task + "'."
  }
}

module.exports = function(bot) {return {run: run}}
