
var sys = require('sys')
  , EventEmitter = require('events').EventEmitter

function Bot() {

  EventEmitter.call(this);

  this.messageFromContact = function(text) {
    // respond with a twisted message
    this.emit('message', '---' + text + '---')
  }
}

sys.inherits(Bot, EventEmitter)


function BotManager() {

  this.addConversation = function(conv, contact) {
    conv.addBot('echobot', new Bot())
  }
}


exports.BotManager = BotManager
