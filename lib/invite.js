/**
 * This script handles invitations.
 * Right now, just everything gets approved.
 * However, the invitation must be made while the client is online.
 */
var xmpp = require('node-xmpp')


/**
 * @param cl
 *   The xmpp client
 */
function InviteApprover(cl) {

  var element = new xmpp.Element('presence', {
    from: 'civibot@dqxtech.net',
    ptype: 'probe'
  })
  setTimeout(function(){
    console.log('---- send probe ----')
    cl.send(element)
    console.log('---- / send probe ----')
  }, 600)

  function onSubscribe(attrs, children) {
    console.log('invitation from', attrs, children)
    var element = new xmpp.Element('presence', {
      from: attrs.to,
      to: attrs.from,
      type: 'subscribe'
    })
    cl.send(element)
  }

  function onStanza(stanza) {
    console.log('stanza from\n', stanza, '\n----')
    if (
      stanza.is('presence') &&
      stanza.attrs.type == 'subscribe'
    ) {
      var children = stanza.getChildren('sub')
      if (children.length) {
        onSubscribe(stanza.attrs, stanza.getChildren('sub'))
      }
    }
  }

  cl.on('stanza', onStanza)
}


exports.InviteApprover = InviteApprover
