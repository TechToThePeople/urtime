function run(msg, user, callback) {
  callback("error","pong");
}

module.exports = function(bot){return {run: run}}
