var cjson = require('cjson');
var conf = cjson.load('./conf/config.json');
for (var k in conf) {
  exports[k] = conf[k];
}
