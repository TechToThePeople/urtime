/**
 * Starting point for xmpp / timebot
 */


var sys = require('sys')
  , xmpp = require('node-xmpp')
  , conf = require('./config.js')
  , ConversationGarden = require('./lib/xmpp-conversation-garden.js').ConversationGarden
  , InviteApprover = require('./lib/invite.js').InviteApprover
  , TimebotManager = require('./lib/bot/timebot.js').BotManager

var xmppOptions = {
  jid: conf.user,
  password: conf.password,
  host: conf.server,
  port: conf.port
}

console.log('xmppOptions: ', xmppOptions);

// Try to fix..
xmppOptions.jid = new xmpp.JID(xmppOptions.jid)

console.log('xmppOptions.jid: ', xmppOptions.jid)

// Build a client based on our config.
var cl = new xmpp.Client(xmppOptions);

// Add the invite approver
var inviteApprover = new InviteApprover(cl)


// Send our online presence.
// This is necessary to make the bots work.
cl.on('online', function() {

  var element = new xmpp.Element('presence', { })
    .c('show').t('chat').up()
    .c('status').t('Happily echoing your <message/> stanzas')

  cl.send(element)

  console.log('xmpp bot is now online as "' + conf.user + '".')
})


// Set up the conversation garden, to manage bots and contacts.
var convGarden = new ConversationGarden(cl)

// register the manager for the timebot
convGarden.observeConversations(new TimebotManager({ 
  name:'xmpp',
  commandGroups:conf.commandGroups,
}));




