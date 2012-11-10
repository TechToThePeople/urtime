// this allows to run a command from the cli
"use strict";

var msg = process.argv;
msg.shift(); //node
msg.shift(); //do.js
msg = msg.join (" "); 
  
var bot=require ('./lib/bot.js').bot ({'name':'cli'});
var user=require ('./lib/user.js').user(process.env.LOGNAME,bot);
console.log (bot.run (msg,user));

//console.log(bot);
