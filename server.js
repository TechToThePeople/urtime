"use strict";

var restify = require('restify');
var path = require('path');
var filed = require('filed');
var mime = require('mime');

var user=require ('./lib/user.js');
var bot=require ('./lib/bot.js').bot ({'name':'web'});


var users = {};



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
  name: 'HAL my time',
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
  if(typeof users[req.params.user] !=  "undefined") {
    res.contentType = 'application/json';
    res.send(req.params.user + ", you are already connected (from the chat or another browser)");
    return next();
  };
  res.send("new user "+req.params.user);
  users[req.params.user] = (new user.new(req.params.user));
  return next();
});

server.post('/:userhash/do', function(req, res, next) {
  var result = bot.run (req.params.cmd,users[req.params.user]);
  res.send(result);
  //res.send("command "+req.params.cmd +" to run for "+req.params.user);
  return next();
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
console.log('Server running at http://0.0.0.0:8000/');
