
var sys = require('sys')
  , EventEmitter = require('events').EventEmitter
  , Timebot = require('../bot.js').bot
  , User = require('../user.js').user

function Bot(timebot, user) {

  EventEmitter.call(this);

  this.messageFromContact = function(text) {
    // TODO: Integrate the timebot thingie
    timebot.run(text, user)
  }
}

sys.inherits(Bot, EventEmitter)


function BotManager(settings) {

  var timebot = new Timebot(settings)

  this.addConversation = function(conv, contact) {
    var user = new User(contact, timebot)
    conv.addBot('timebot', new Bot(timebot, user))
  }
}

exports.BotManager = BotManager
