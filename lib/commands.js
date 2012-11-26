
var fs = require('fs')
var _ = require('underscore')

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

function isValidCommandFile(file) {
  return (file.slice(-3) == '.js') ? true : false
}

function getInvalidCommand() {
  return require('../commands/invalid.js')(this);
}

function getHelpCommand() {
  return require('../commands/main/help.js')(this);
}


function collectCommands(folder) {

  var commands = []
  if (typeof folder == "undefined") folder ="";
  folder = "./commands/" + folder;
  
  function consumeCommandFile(file) {
    var result = require("."+folder + file)();

    if (typeof result.contextual != "undefined" && result.contextual)
      return; // this is a contextual command, skip it
    if (typeof result.run == 'function') {
      // This is a single command.
      var cmd = result
      var k = cmd.name || file.slice(0, -3)
      prepareCommand(k, cmd)
      commands.push(cmd)
    }
    else {
      var commandsInFile = result
      // These are several commands.
      for (var k in commandsInFile) {
        prepareCommand(k, commandsInFile[k])
        commands.push(commandsInFile[k]);
      }
    }
  }

  fs.readdirSync(folder)
    .filter(isValidCommandFile)
    .forEach(consumeCommandFile)

  return commands
}

// static cache for commands, so we don't collect them twice
var commands = [];

function getCommands(groups) {
  if (commands.length==0) {
    groups = groups || ['main','test','timetrack'];
    _.each (groups, function(group) {
      commands = commands.concat(collectCommands(group+"/"));
    });
  }
  return commands
}


exports.default = getInvalidCommand
exports.help = getHelpCommand
exports.all = getCommands
