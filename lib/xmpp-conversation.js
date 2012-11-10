/**
 * Represents a conversation between our xmpp bot account and one user.
 */

var xmpp = require('node-xmpp')

/**
 * @param cl
 *   The XMPP Client object
 */
function Conversation(cl, contact) {

  // all the subscribed bots for this contact
  var bots = {}

  var jid = cl.jid.toString().split('/')[0]

  function onBotMessage(key, message) {
    // TODO: Create a full message stanza
    var stanza = new xmpp.Element('message', {to: contact, type: 'chat'});
    stanza.c('body').t(message)
    cl.send(stanza)
  }

  function onBotStatus(key, status) {
    return
    var presence = new xmpp.Element('presence')
    cl.send(presence)
  }

  /**
   * To be called from ConversationGarden
   */
  this.addBot = function(key, bot) {
    if (typeof key != 'string') {
      throw new Error("Every bot must be registered with a string key.")
    }
    if (bots[key]) {
      throw new Error("Key '" + key + "' is already occupied with a bot.")
    }
    bots[key] = bot
    bot.on('message', function(message){
      onBotMessage(key, message)
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
