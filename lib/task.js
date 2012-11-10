var fs = require ('fs');
exports.tasks = tasks;

function tasks (user, callback) {

  this.file = null;
  this.actives = [];//["procastination"];
 
  var task = this;
 
  this.fileName = function () {
    return "task/"+user.name+".json";
  }

  this.add = function (name,callback) { //TODO: fix the race condition with readFile (if trying to add before)

    if (task.actives.indexOf(name) !== -1) { // already in todo
      callback && callback(this.actives.indexOf(name));
    }

    var pos = task.actives.push(name) -1;
    fs.writeFile(task.fileName(), JSON.stringify(this.actives), 'utf-8' ,function (err) {
       if (err) throw err;
       this.file = task.fileName();
       callback && callback(pos);
    });
  }

  fs.readFile(task.fileName(), "utf-8" , function (err,data) {
    if (err) {
      task.actives = ["procrastination"];
      callback && callback (task.actives.length);
      return;
    }
    try {
      task.actives = JSON.parse(data);
    } catch (e) {
      task.actives = ["fix the todo file " + task.fileName()];
    }
    callback && callback (task.actives.length);
  });

  return this;
}
