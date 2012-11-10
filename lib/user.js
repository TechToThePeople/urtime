exports.user = user;

function user (name,bot) {
  this.lastcmd = null;//last command run from the bot
  this.name = name;
  this.tasks = ["proscratination"];
  this.current = null;//id of the current task she's working on
  this.since = null;//time she started working on the task

  
  this.start = function (task) {
    this.current = task || 0;
    this.since = new Date().getTime();
  }

  this.stop = function (msg) {
    if (!this.since) return false;
    end = new Date().getTime();
    var result = {
      duration: end - this.since,
      task:this.tasks[this.current],
      current:this.current, //might be useful
    };
    this.current = this.since = null;
    return result;
  }
  return this;
}
