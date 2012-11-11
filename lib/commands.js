
var fs = require('fs')

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
  return (file.slice(0, 4) == 'cmd.') ? true : false
}

function getInvalidCommand() {
  return require('../commands/invalid.js')(this);
}

function collectCommands() {

  var commands = []

  function consumeCommandFile(file) {

    var result = require('../commands/' + file)();

    if (typeof result.run == 'function') {
      // This is a single command.
      var cmd = result
      var k = cmd.name || file.slice(4, -3)
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

  fs.readdirSync('./commands')
    .filter(isValidCommandFile)
    .forEach(consumeCommandFile)

  return commands
}


function getCommandsHelp() {
  var commands = collectCommands()
  var names = []
  for (var i = 0; i < commands.length; ++i) {
    names.push(commands[i].name)
  }
  return "Known commands: " + names.join(', ')
}

exports.getInvalidCommand = getInvalidCommand
exports.collectCommands = collectCommands
exports.getCommandsHelp = getCommandsHelp
