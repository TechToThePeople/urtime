var trigger= function(msg, user) {
  return (msg.toLowerCase() == "yes" || msg.toLowerCase() == "y"); 
} 

function run (msg, user,callback) {
  console.log ("create task " + this.task);
  user.start(this.task);
  user.removeContextual(this);
  callback ("success", {
    text: "Working on "+this.task
  });
}

module.exports = function(task) {return {task:task, trigger:trigger, contextual:true, name:"yes create task", run: run}}
