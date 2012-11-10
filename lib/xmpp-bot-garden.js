/**
 * This script connects an xmpp client with one or more bots.
 *
 * The bots only receive messages and respond by emitting events. They know
 * nothing about xmpp, they work just as nicely with commandline or anything.
 */

/**
 * @param cl
 *   The XMPP client, as created with require('node-xmpp').Client()
 */
function BotGarden(cl) {

  // all the subscribed bots
  var bots = {}

  function onOnline() {
  }

  function onMessage(from, text) {
    for (var k in bots) {
      bots[k].sendMessage(text, from)
    }
  }

  function onStanza(stanza) {
    if (stanza.is('message')) {
      if (stanza.attrs.type != 'error') {
        var text = ''
        stanza.getChildren('body').forEach(function(bodyElement){
          body += bodyElement.children.join('')
        })
        if (text.length) {
          onMessage(stanza.attrs.from, text)
        }
      }
    }
  }

  cl.on('online', onOnline)
  cl.on('stanza', onStanza)

  function onBotMessage(key, message) {
    // TODO: Create a full message stanza
    var stanza = new xmpp.Element('stanza', {})
    cl.send(stanza)
  }

  function onBotStatus(key, status) {
    return
    var presence = new xmpp.Element('presence')
    cl.send(presence)
  }

  this.addBot = function(key, bot) {
    bots[key] = bot
    bot.on('message', onBotMessage)
    bot.on('status', onBotStatus)
  }
}
