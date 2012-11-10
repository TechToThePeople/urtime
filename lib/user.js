exports.user = user;

function user (name,bot) {
  this.lastcmd = null;
  this.name = name;
  
  return this;
}
