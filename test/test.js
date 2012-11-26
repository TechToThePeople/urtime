var assert = require("assert");
var conf = require('../config.js');
var User = require('../lib/user.js').User;
var Bot = require ('../lib/bot.js').Bot;

var bot = new Bot({'name':'web',
commandGroups:conf.commandGroups,
});

User.connect("Dave", function(greeting){});

describe('Command', function(){
  describe('#help', function(){
    it('should return a list of commands', function(done){
      var result = bot.run ("help",User.users["Dave"],function (type,data){
        console.log(typeof data);
        done();
//      assert.equal(1,data);
      });
//      assert.equal(,);
    })
  })
})
