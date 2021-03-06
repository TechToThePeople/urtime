
var sys = require('sys')
  , EventEmitter = require('events').EventEmitter
  , Timebot = require('../bot.js').Bot
  , userJs = require('../user.js')


/**
 * Bot instance specific to one contact/conversation.
 *
 * @param timebot
 *   Instance of the bot at ../lib/bot.js
 * @param user
 *   Instance of the user at ../lib/user.js
 */
function Bot(timebot, user) {

  EventEmitter.call(this);

  var self = this

  function responseCallback(type, data) {
    self.emit('message', data, type)
  }

  this.messageFromContact = function(text) {
    // There are two ways the timebot can send a response.
    // Either as return value, or by calling the callback. Or both.
    var response = timebot.run(text, user, responseCallback)
    if (response) {
      self.emit('message', response)
    }
  }
}

sys.inherits(Bot, EventEmitter)


/**
 * BotManager, that creates a bot instance for every contact/conversation.
 * It is subscribed to the ConversationGarden as an observer.
 *
 * Hint: One conversation per contact.
 * Conversations are lazy-created at the first time a contact sends a message.
 *
 * @param settings
 *   The settings for the bot at ../lib/bot.js.
 *   Currently these don't have a meaning, but look yourself at ../lib/bot.js
 */
function BotManager(settings) {

  // Create an instance of the ../lib/bot.js bot.
  var timebot = new Timebot(settings)

  // This method is called by the conversation garden
  // - for every conversation that already exists when the BotManager is
  //   subscribed.
  // - for every new conversation that is created
  this.addConversation = function(conv, contact) {
    var user = userJs.getUser(contact, function(greeting){
      // onUserConnect callback
      conv.sendMessage(greeting)
    })
    conv.addBot('timebot', new Bot(timebot, user))
  }
}

exports.BotManager = BotManager
