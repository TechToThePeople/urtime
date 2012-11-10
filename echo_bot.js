/**
 * Echo Bot - the XMPP Hello World
 *
 * In this script we do a number of experiments.
 * - run the echo bot.
 * - ask for the roster via IqEngine. Doesn't work :(
 * - send an IQ stanza to the server. This crashes the bot :(
 **/
var sys = require('sys')
  , xmpp = require('node-xmpp')
  , conf = require('./config.js')

// Build a client.
var cl = new xmpp.Client({
  jid: conf.user,
  password: conf.password,
  host: conf.server,
  port: conf.port
});

// IqEngine can ask for the roster. Unfortunately, this does not really work.
var iqEngine = new (require('./lib/iq-engine.js')).IqEngine(cl)
console.log(iqEngine)
// Commented out, because it crashes the bot.
// iqEngine.getRoster(function(contacts){console.log(contacts)})

cl.on('online',
      function() {
      cl.send(new xmpp.Element('presence', { }).
          c('show').t('chat').up().
          c('status').t('Happily echoing your <message/> stanzas')
         );
      });
cl.on('stanza',
      function(stanza) {
      if (stanza.is('message') &&
          // Important: never reply to errors!
          stanza.attrs.type !== 'error') {

          // Swap addresses...
          stanza.attrs.to = stanza.attrs.from;
          delete stanza.attrs.from;
          // and send back.
          cl.send(stanza);
      }
      });
cl.on('error',
      function(e) {
      sys.puts(e);
      });

// Build an iq stanza that we want to send, just to see if it works.
// This is the small version, without any response callback. We only want to see
// if the sending breaks anything.
var requestElement = new xmpp.Element('iq', {type: 'get', id: 'abcdefgj', from: 'civibot@dqxtech.net'})
var queryElement = new xmpp.Element('query', {xmlns: 'jabber:iq:roster'})
requestElement.cnode(queryElement)
// Commented out, because it crashes the bot.
// cl.send(requestElement)

