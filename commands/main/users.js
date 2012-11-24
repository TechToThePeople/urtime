var _ = require ('underscore');
var users = require ('../../lib/user.js').User.users;

function run(msg, user, callback) {
  var nb = _.keys(users).length;
  callback("success",{active:nb, text:'They are currently '+nb+' active users'});
}

module.exports = function(bot){return {run: run}}
