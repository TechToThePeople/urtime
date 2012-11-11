/**
 * This script handles invitations.
 * Right now, just everything gets approved.
 * However, the invitation must be made while the client is online.
 */
var xmpp = require('node-xmpp')


/**
 * Object that responds to invites / subscriptions.
 *
 * @param cl
 *   The xmpp client
 */
function InviteApprover(cl) {

  function sendSubscription(contact) {
    var element = new xmpp.Element('presence', {
      from: cl.jid.toString()[0],
      to: contact,
      type: 'subscribe'
    })
    cl.send(element)
  }

  function onStanza(stanza) {
    if (stanza.is('presence')) {
      if (stanza.attrs.type == 'error') {
        // console.log('stanza.presence.error', stanza, stanza.attrs, stanza.getChildren())
      }
      else {
        // console.log('stanza.presence', stanza.attrs.from, stanza.attrs.to, stanza.attrs.type)
      }
    }
    if (
      stanza.is('presence') &&
      stanza.attrs.type == 'subscribe'
    ) {
      var children = stanza.getChildren('sub')
      if (children.length) {
        console.log('invitation from', attrs, children)
        sendSubscription(attrs.from.split('/')[0])
      }
    }
  }

  cl.on('stanza', onStanza)

  function onOnline() {
    // sendProbe()
  }

  cl.on('online', onOnline)

  /**
   * Not sure if we need this at all.
   * The idea was that we can motivate our not-yet-approved contacts to resend
   * the invitation. But it doesn't seem to work.
   */
  function sendProbe() {
    var element = new xmpp.Element('presence', {
      from: cl.jid.toString()[0],
      ptype: 'probe'
    })
    console.log('---- send probe ----')
    cl.send(element)
    console.log('---- / send probe ----')
  }
}


exports.InviteApprover = InviteApprover
