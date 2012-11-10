/**
 * Manage a number of conversations
 */

var Conversation = require('./xmpp-conversation.js').Conversation

function ConversationGarden(cl) {

  var conversations = {}
  var conversationObservers = []

  /**
   * Create a conversation with this contact, if it doesn't exist.
   *
   * @param string contact
   *   The name (email) of the contact
   */
  function conversationWith(contact) {
    if (!conversations[contact]) {
      var conv = new Conversation(cl, contact)
      for (var i = 0; i < conversationObservers.length; ++i) {
        conversationObservers[i].addConversation(conv, contact)
      }
      conversations[contact] = conv
    }
    return conversations[contact]
  }

  function onStanza(stanza) {
    if (stanza.is('message')) {
      if (stanza.attrs.type != 'error') {
        var text = ''
        stanza.getChildren('body').forEach(function(bodyElement){
          text += bodyElement.children.join('')
        })
        if (text.length) {
          // TODO: Why is the address sitting in 'to' instead of 'from' ?
          var contact = stanza.attrs.from.split('/')[0]
          conversationWith(contact).messageFromContact(text)
        }
      }
    }
  }

  cl.on('stanza', onStanza)

  /**
   * That's the way to add bots to every new and existing conversation.
   */
  this.observeConversations = function(observer) {
    for (var contact in conversations) {
      observer.addConversation(conversations[contact], contact)
    }
    conversationObservers.push(observer)
  }
}

exports.ConversationGarden = ConversationGarden
