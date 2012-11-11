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

  var iqEngine = new IqEngine(cl)
  var jid = cl.jid.toString().split('/')[0]
  var contacts = {}

  function approveContact(contact) {
    var element = new xmpp.Element('presence', {
      from: jid,
      to: contact,
      type: 'subscribe'
    })
    cl.send(element)
    iqEngine.addRosterContact(contact)
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
    iqEngine.getRoster(function(rosterContacts){
      for (var contact in rosterContacts) {
        if (rosterContacts[contact].subscription == 'both') {
          // We don't need to approve this one anymore.
          contacts[contact] = true
        }
      }
    })
  }

  function onId(stanza) {
    // console.log('----> id: ', stanza, '<-----')
  }

  cl.on('stanza', onStanza)
  cl.on('online', onOnline)
  cl.on('id', onId)
}


exports.InviteApprover = InviteApprover
