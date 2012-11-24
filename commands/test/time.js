function time(msg, user) {
  return (new Date()).toLocaleString()
}

module.exports = function(bot){return {run: time}}
