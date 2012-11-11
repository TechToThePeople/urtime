if (process.env.NODE_ENV ==='production') {
  exports = {
    user:process.env.XMPP_USER,
    password: process.env.XMPP_PASSWORD,
    server: 'talk.google.com',
    port: '5222' 
  };
console.log(exports);
} else {
  var cjson = require('cjson');
  var conf = cjson.load('./conf/config.json');
  for (var k in conf) {
    exports[k] = conf[k];
  }
};

