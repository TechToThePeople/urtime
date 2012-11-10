// this allows to run a command from the cli
"use strict";

require ('./commands/ping.js');

var msg = process.argv;
msg.shift(); //node
msg.shift(); //do.js
msg = msg.join (" "); 
console.log("Running...", msg);

  
var bot=require ('./lib/bot.js').bot ({'name':'cli'});
console.log (bot.run (msg,{}));

//console.log(bot);
