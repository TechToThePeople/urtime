if (process.env.NODE_ENV ==='production') {
  module.exports = {
    user:process.env.XMPP_USER,
    password: process.env.XMPP_PASSWORD,
    server: 'talk.google.com',
    port: '5222' 
  };
} else {
  var cjson = require('cjson');
  var conf = cjson.load('./conf/config.json');
  exports.civicrm =conf.civicrm;
  for (var k in conf) {
    exports[k] = conf[k];
  }
  exports.commandGroups = ["main","test","timetrack","civicrm"]
};

