/**
 * This script handles invitations.
 * Right now, just everything gets approved.
 * However, the invitation must be made while the client is online.
 */
var xmpp = require('node-xmpp')
  , IqEngine = require('./iq-engine.js').IqEngine


/**
 * Object that responds to invites / subscriptions.
 *
 * @param cl
 *   The xmpp client
 */
function InviteApprover(cl) {

  var jid = cl.jid.toString().split('/')[0]
  var contacts = {}

  function approveContact(contact) {
    var element = new xmpp.Element('presence', {
      from: jid,
      to: contact,
      type: 'subscribe'
    })
    cl.send(element)
    console.log('approve contact: ', contact)
  }

  function initContact(contact) {
    if (!contacts[contact]) {
      // Approve the contact.
      if (contact != jid) {
        approveContact(contact)
      }
      contacts[contact] = true
    }
  }

  function onStanza(stanza) {
    if (stanza.attrs.from) {
      // No matter what this contact is trying to do, we approve it.
      var contact = stanza.attrs.from.split('/')[0]
      initContact(contact)
    }
  }

  function onOnline() {
    // The iqEngine.getRoster() has a healthy side effect:
    // It lets all the pending contacts send a presence stanza.
    var iqEngine = new IqEngine(cl)
    iqEngine.getRoster(function(){})
  }

  function onId(stanza) {
    // console.log('----> id: ', stanza, '<-----')
  }

  cl.on('stanza', onStanza)
  cl.on('online', onOnline)
  cl.on('id', onId)

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
