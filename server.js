"use strict";

var restify = require('restify');
var path = require('path');
var filed = require('filed');
var mime = require('mime');

var users = {};



//adapted from mcavage https://github.com/mcavage/node-restify/issues/101
function serve(req, res, next) {
console.log ("serving");
    var fname = path.normalize('./static' + req.path);
    var log = req.log;

    console.log('GET %s maps to %s', req.path, fname);

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

server.get('/:user/connect', function(req, res, next) {
res.contentType = 'application/json';
  res.send("new user "+req.params.user);
    return next();
});

server.post('/:user/do/:command', function(req, res, next) {
  res.send("command "+req.params.command +" to run for "+req.params.user);
  return next();
});

server.get('/:user/task', function(req, res, next) {
  res.send("task for "+req.params.user);
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

server.get(/\/public\/\S+/, function (req, res, next) {
 return serve(req, res, next);
});


/*server.get(/^\/([a-zA-Z0-9_\.~-]+)\/(.*)/, function(req, res, next) {
  console.log(req.params[0]);
  console.log(req.params[1]);
  res.send(200);
  return next();
});
*/


server.listen(8000);
console.log('Server running at http://0.0.0.0:8000/');
