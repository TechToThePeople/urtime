/**
 * Represents a conversation between our xmpp bot account and one user.
 */

var xmpp = require('node-xmpp')

/**
 * @param cl
 *   The XMPP Client object
 * @param string contact
 *   The user identifier, e.g. username@example.com
 */
function Conversation(cl, contact) {

  // all the subscribed bots for this contact
  var bots = {}

  var jid = cl.jid.toString().split('/')[0]

  function onBotMessage(key, data, type) {
    var stanza = new xmpp.Element('message', {to: contact, type: 'chat'});
    var message = (typeof data == 'string') ? data : data.toString()
    console.log('xmpp sending message ' + message)
    stanza.c('body').t(message)
    cl.send(stanza)
  }

  function onBotStatus(key, status) {
    return
    var presence = new xmpp.Element('presence')
    cl.send(presence)
  }

  /**
   * Register a bot to the conversation.
   * This is typically called by conversation observers.
   *
   * @param string key
   *   A key to identify this bot.
   * @param bot
   *   The bot object. This must have a method bot.messageFromContact(text),
   *   that will be called for every message coming from the contact.
   *   The bot can respond by emitting a 'message' event.
   */
  this.addBot = function(key, bot) {
    if (typeof key != 'string') {
      throw new Error("Every bot must be registered with a string key.")
    }
    if (bots[key]) {
      throw new Error("Key '" + key + "' is already occupied with a bot.")
    }
    bots[key] = bot
    bot.on('message', function(data, type) {
      onBotMessage(key, data, type)
    })
    bot.on('status', onBotStatus)
  }

  /**
   * To be called from ConversationGarden
   */
  this.messageFromContact = function(text) {
    for (var k in bots) {
      bots[k].messageFromContact(text)
    }
  }
}

exports.Conversation = Conversation
