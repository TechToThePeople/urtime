
var sys = require('sys')
  , EventEmitter = require('events').EventEmitter

/**
 * Example bot, which just parrots the messages thrown at it.
 */
function Bot() {
  // Call the parent constructor
  EventEmitter.call(this);

  /**
   * This is called when the contact posts a chat message.
   *
   * @param text
   *   The message text.
   */
  this.messageFromContact = function(text) {
    // respond with a twisted message
    this.emit('message', '---' + text + '---')
  }
}

sys.inherits(Bot, EventEmitter)


/**
 * BotManager, which subscribes a new Bot instance for every conversation it is
 * notified about.
 */
function BotManager() {

  /**
   * Observer callback to be notified about new conversations.
   *
   * @param conv
   *   The conversation object
   * @param string contact
   *   The contact identifier, e.g. name@example.com
   */
  this.addConversation = function(conv, contact) {
    // Register a new bot instance with key 'echobot'.
    conv.addBot('echobot', new Bot())
  }
}


exports.BotManager = BotManager
