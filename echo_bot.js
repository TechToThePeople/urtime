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
  , IqEngine = require('./lib/iq-engine.js').IqEngine
  , InviteApprover = require('./lib/invite.js').InviteApprover
  , ConversationGarden = require('./lib/xmpp-conversation-garden.js').ConversationGarden
  , EchobotManager = require('./lib/bot/echobot.js').BotManager
  , TimebotManager = require('./lib/bot/timebot.js').BotManager

// Build a client.
var cl = new xmpp.Client({
  jid: conf.user,
  password: conf.password,
  host: conf.server,
  port: conf.port
});

// Catch and print all events from the xmpp client.
if (false) {
  var emitt = cl.emit;
  cl.emit = function() {
    var args = arguments
    // console.log('cl.emit', args)
    return emitt.apply(this, args)
  }
}

// Send our online presence.
// This is necessary to make the bots work.
function onOnline() {

  var element = new xmpp.Element('presence', { })
    .c('show').t('chat').up()
    .c('status').t('Happily echoing your <message/> stanzas')
  cl.send(element)

  // IqEngine can ask for the roster.
  // (we don't actually do that, but...)
  var iqEngine = new IqEngine(cl)
  // iqEngine.getRoster(function(contacts){console.log(contacts)})
}

cl.on('online', onOnline)

// var inviteApprover = new InviteApprover(cl)

// Set up the conversation garden, to manage bots and contacts.
var convGarden = new ConversationGarden(cl)
convGarden.observeConversations(new EchobotManager())
convGarden.observeConversations(new TimebotManager({}))



