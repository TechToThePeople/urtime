"use strict";

var restify = require('restify');
var path = require('path');
var filed = require('filed');
var mime = require('mime');

var User = require('./lib/user.js').User;
var Bot = require ('./lib/bot.js').Bot;

var bot = new Bot({'name':'web',
});

//adapted from mcavage https://github.com/mcavage/node-restify/issues/101
function serve(req, res, next) {
    var fname = path.normalize('./static' + req.path);
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
  if (User.connect(req.params.user, bot.name)) {
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
      res.write(JSON.stringify(data));
    } else {
      res.write(data);
    }
    if (type != "partial") {
      res.end();
    } 
  });
  if (result) {
    var resultBr = result.replace('\n', '<br/>')
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
  socket.emit('bot', { text: 'Affirmative, Dave. I read you.' });
  socket.on('command', function (req) {
console.log(req);
    if (! User.exists(req.user)) // should never happen, but better safe than sorry
      User.connect(req.user,bot.name);
    var result = bot.run (req.cmd,User.users[req.user]
      ,function (type,data){
      if (typeof data == "string") {
        var t= data, data = {}; 
        data.text = t;
      }
      data.id = req.id;
      data.type = type;
      socket.emit('bot', data);
      console.log(data);
    });
    if (result) {
      var resultBr = result.replace('\n', '<br/>');
      socket.emit('bot', {type:'success',id:req.id,text:resultBr});
    };
  });
});
console.log('Server running at http://0.0.0.0:8000/');
