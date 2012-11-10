
var _ = require('underscore')
  , fs = require('fs')

function runNotImplemented(msg, user) {
  return 'Not implemented yet.'
}

function prepareCommand(k, cmd) {
  cmd.name = cmd.name || k
  cmd.run = cmd.run || runNotImplemented
  cmd.trigger = cmd.trigger || function(msg, user) {
    return cmd.name == msg || msg.indexOf(k + " ") == 0;
  }
  cmd.param = cmd.param || function(msg) {
    return msg.substr(cmd.name.length + 1)
  }
}

function Bot (settings) {

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
       var commands = require('../commands/'+file)(bot);
       if (typeof commands.run == 'function') {
         // This is a single command.
         var cmd = commands
         var k = cmd.name || file.slice(4, -3)
         prepareCommand(k, cmd)
         bot.cmd.push(cmd)
       }
       else {
         for (var k in commands) {
           prepareCommand(k, commands[k])
           bot.cmd.push(commands[k]);
         }
       }
    });

  this.run = function (msg, user){
    console.log ("asked " + msg);
    var i = _.find(this.cmd, function(cmd) {
      return cmd.trigger(msg);
    });
    if (typeof i == "undefined") {
      return invalid.run (msg, user);
    }
    return i.run (msg, user);
  }
  return this;
}


exports.Bot = Bot
// legacy
exports.bot = Bot
