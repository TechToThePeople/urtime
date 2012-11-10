exports.bot = bot;
var _ = require('underscore');
var fs = require('fs');

function bot (settings) {
  var bot = this;
  this.settings = {};
  this.cmd = [];
  this.default = {
    name:"miss moneypenny",
  }
  _.extend(this.settings, this.default, settings); 

  var invalid = require('../commands/invalid.js')(this);
  fs.readdirSync('./commands')
  .filter(function(file) { return file.slice (0,4) == 'cmd.'; })
  .forEach(function(file) { 
     var cmd = require('../commands/'+file)(this);
     cmd.name = cmd.name || file.slice(4,-3);
     cmd.run = cmd.run || function (msg, user, bot){return "Not implemented yet"};
     cmd.trigger = cmd.trigger || function (msg, user, bot) { 
       return cmd.name == msg || msg.indexOf(cmd.name + " ") == 0;
     };
     cmd.param = cmd.param || function (msg) { return msg.substr (this.name.length +1) };
     bot.cmd.push (cmd);
  });
 

  this.run = function (msg, user){
    console.log ("asked "+msg);
    var i = _.find(this.cmd,function (cmd) {
      return cmd.trigger(msg);
    });
    if (typeof i == "undefined") {
      return invalid.run (msg, user, this);
    }
    return i.run (msg, user, this);
  }
  return this;
}

