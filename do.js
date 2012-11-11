// this allows to run a command from the cli
"use strict";

var Bot = require('./lib/bot.js').Bot
var User = require('./lib/user.js').User

var msg = process.argv;
msg.shift(); //node
msg.shift(); //do.js
msg = msg.join (" "); 

var bot = new Bot({'name':'cli'});
var user = new User(process.env.LOGNAME, bot);
console.log (bot.run (msg, user));

//console.log(bot);
