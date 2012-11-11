var xmpp = require('node-xmpp')
var sys = require('sys')

/**
 * An IqEngine can send iq stanzas to the xmpp server, and receive responses.
 *
 * @param xmpp.Client cl
 *   A client generated with xmpp.Client()
 */
function IqEngine(cl) {

  var nextIndex = 0;
  var iqResponseHandlers = {}

  cl.on('stanza', function(stanza) {
    // Check if that's a response to an iq request we sent before.
    if (stanza.name == 'iq') {
      var responseHandler = iqResponseHandlers[stanza.attrs.id]
      if (responseHandler) {
        responseHandler.handleResponseStanza(cl, stanza)
      }
    }
  })

  /**
   * Send an IQ request, and set a response handler
   */
  this.iq = function(requestElement, responseHandler) {
    var id = 'node_iq_' + nextIndex
    requestElement.attrs.id = id
    iqResponseHandlers[id] = responseHandler
    ++nextIndex
    cl.send(requestElement)
    return
  }
}

function IqResponseHandler(onSuccess, onError) {

  /**
   * Handle the response
   */
  this.handleResponseStanza = function(cl, stanza) {

    switch (stanza.attrs.type) {

      case 'error':
        onError.apply(cl, [stanza])
        break

      case 'result':
        onSuccess.apply(cl, [stanza])
        break

      default:
        // Let's just do nothing here?
    }
  }
}


IqEngine.prototype.query = function(xmlns, callback, enhanceQueryElement) {

  // Build the request iq stanza, without id.
  // (the id is inserted later)
  var requestElement = new xmpp.Element('iq', {type: 'get'})
  var queryElement = new xmpp.Element('query', {xmlns: xmlns})
  if (typeof enhanceQueryElement == 'function') {
    enhanceQueryElement(queryElement, requestElement)
  }
  requestElement.cnode(queryElement)

  // callback if we receive a response iq stanza
  function onSuccess(iqResponseStanza) {
    var resultElement = iqResponseStanza.getChild('query', xmlns)
    callback(resultElement)
  }

  function onError() {
    // do nothing.
    console.log('error')
  }

  // Build the response handler
  var responseHandler = new IqResponseHandler(onSuccess, onError)

  this.iq(requestElement, responseHandler)
}


IqEngine.prototype.getRoster = function(callback) {

  function queryCallback(resultElement) {
    var contacts = {}
    resultElement.getChildren('item').forEach(function(child){
      contacts[child.attrs.jid] = child.attrs
      return
      contacts[child.attrs.jid] = {
        name: child.attrs.jid,
        subscription: child.attrs.subscription
      }
    })
    callback(contacts)
  }

  this.query('jabber:iq:roster', queryCallback)
}


IqEngine.prototype.addRosterContact = function(contact) {

  function queryCallback(resultElement) {
    // Do nothing
    // console.log('----')
    // console.log(resultElement)
  }

  function enhanceQueryElement(queryElement, requestElement) {
    // Add our roster element.
    queryElement.cnode(new xmpp.Element('item', {jid: contact, subscription: 'both'}))
    requestElement.attrs.type = 'set'
  }

  this.query('jabber:iq:roster', queryCallback, enhanceQueryElement)
}


exports.IqEngine = IqEngine
