"use strict";

var restify = require('restify');
var path = require('path');
var filed = require('filed');
var mime = require('mime');
var _ = require('underscore');

var conf = require('./config.js')
var User = require('./lib/user.js').User;
var Bot = require ('./lib/bot.js').Bot;

var bot = new Bot({'name':'web',
commandGroups:conf.commandGroups,
});

//adapted from mcavage https://github.com/mcavage/node-restify/issues/101
function serve(req, res, next) {
    var fname = path.normalize('./static' + req.path());
    var log = req.log;

    /* JSSTYLED */
    if (!/^static\/?.*/.test(fname))
        return next(new restify.NotAuthorizedError());
    res.contentType = mime.lookup(fname);
    var f = filed(fname);
    f.pipe(res);
    f.on('end', function () {
        return next(false);
    });

    return false;
}

var server = restify.createServer({
  name: 'HTTP',
  'text/html': function formatHTML(req, res, body) {
      if (typeof (body) === 'string')
          return body;

      var html;
      if (body instanceof Error) {
          html = sprintf(HTML_FMT, body.stack);
      } else if (Buffer.isBuffer(body)) {
          html = sprintf(HTML_FMT, body.toString('base64'));
      } else {
          html = sprintf(HTML_FMT, body.toString());
      }

      return html;
  },
  'text/css': function formatCSS(req, res, body) {
      if (typeof (body) === 'string')
          return body;

      return '';
  },

  'image/png': function formatPNG(req, res, body) {
      return body;
  }
});

server.use(restify.throttle({
  burst: 100,
  rate: 50,
  ip: true,
  overrides: {
    '127.0.0.1': {
      rate: 0,        // unlimited
      burst: 0
    }
  }
}));

server.use(restify.bodyParser({ }));

server.post('/user/connect', function(req, res, next) {
  res.contentType = 'application/json';
  var connected = User.connect(req.params.user, function(greeting){
console.log ("connection");
    // TODO: Send a greeting
  })
  if (connected) {
    res.send("new user " + req.params.user);
    return next();
  }
  res.contentType = 'application/json';
  res.send(req.params.user + ", you are already connected (from the chat or another browser)");
  return next();
});

server.post('/:userhash/do', function(req, res, next) {
  if (! User.exists(req.params.user)) // should never happen, but better safe than sorry
    User.connect(req.params.user,bot.name);

  var result = bot.run (req.params.cmd,User.users[req.params.user]
  ,function (type,data){
    if (type == "error") {  
      res.send(500,data);
      return;
    }
    if (typeof data == "object") {
      res.contentType = 'application/json';
      if (data.text) {
        data.text = data.text.replace('\n', "<br/>\n")
      }
      res.write(JSON.stringify(data));
    } else {
      res.write(data);
    }
    if (type != "partial") {
      res.end();
    } 
  });
  if (result) {
    var resultBr = result.replace('\n', "<br/>n")
    res.send(resultBr);
    return next();
  };
});




server.get('/:user/task', function(req, res, next) {
  res.send("tasks for "+req.params.user);
    return next();
});

server.get('/:user/timesheet', function(req, res, next) {
  res.send("timesheet for "+req.params.user);
    return next();
});

//server.get('/public/test.html', serve);
server.get('/', function (req, res, next) {
 req.path="/index.html";
 return serve(req, res, next);
});

server.get(/\/inspiritas-bootstrap\/\S+/, function (req, res, next) {
 return serve(req, res, next);
});

server.get(/\/public\/\S+/, function (req, res, next) {
 return serve(req, res, next);
});

server.listen(8000);

var io = require('socket.io').listen(server.server,{
  'log level':2
});

io.sockets.on('connection', function (socket) {

  socket.on('connect', function (req) {
console.log ("here");
    var uniq = 'reply' + (new Date()).getTime();
      socket.emit ('bot', {type:"alert",text: "Affirmative, Dave. I read you.", id:uniq});      
      User.connect(req.user, function(greeting, user){
        _.delay(function(){
           socket.emit ('bot', {id:uniq, text: "I've still got the greatest enthusiasm and confidence in the mission. And I want to help you, "+ user.firstname+".<br>I have assigned you to the task 'Procastination'."});
         socket.emit ('work', {task:0, action:"start"});
        }, 3000);
  console.log("return from connect");

        _.delay(function(){
          socket.emit ('bot', {id:uniq, text: "Look "+user.firstname+", I can see you're really upset about this.<br>I honestly think you ought to use the command form above.<br>You can type <i>'add task take a stress pill, and think things'</i>.<br/> Or any other task. it just has to start by <i>add task </i>, so I know what to do"});
        }, 15000);

        _.delay(function(){
          socket.emit ('bot', {id:uniq, type: "error",text: "Just what do you think you're doing, Dave?<br>If you have a gtalk/xmpp account "+user.firstname+", you should connect to me. <br>I'm <b>bot@urt.im</b> and I will gladly accept your invitation to chat"});
        }, 42000);
        _.delay(function(){
          socket.emit ('bot', {id:uniq, text: user.firstname+", this conversation can serve no purpose anymore. Use the command form above, you can start by <i>'help'</i>. I will let you discover at your own pace."});
        }, 55000);
        _.delay(function(){
          socket.emit ('bot', {id:uniq, type:"info", text: user.firstname+", If I haven't bothered you too much already, may I kindly request you to click on the 'vote' button under?"});
        }, 63000);

    });
  });

  socket.on('command', function (req) {
    if (! User.exists(req.user)) // should never happen, but better safe than sorry
      User.connect(req.user, function(greeting, user){
//        socket.emit('bot', {text: greeting})
      });
    var result = bot.run (req.cmd,User.users[req.user]
      ,function (type,data){
      if (typeof data == "string") {
        var t= data, data = {}; 
        data.text = t;
      }
      if (data.text) {
        data.text = data.text.replace(/\n/g, '<br />');
      }
      data.id = req.id;
      data.type = type;
      socket.emit('bot', data);
    });
    if (result) {
      result = result.replace(/\n/g, '<br />');
      socket.emit('bot', {type:'success',id:req.id,text:result});
    };
  });
});
console.log('Server running at http://0.0.0.0:8000/');
