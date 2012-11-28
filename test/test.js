var assert = require("assert");
var conf = require('../config.js');
var User = require('../lib/user.js').User;
var Bot = require ('../lib/bot.js').Bot;

var bot = new Bot({'name':'web',
commandGroups:conf.commandGroups,
});

User.connect("Dave", function(greeting){});

describe('Command', function(){
  describe('#ping', function(){
    it('should return pong', function(done){
      var result = bot.run ("ping",User.users["Dave"],function (type,data){
        assert.equal("pong",data);
        done();
      });
    })
  })
  describe('#echo', function(){
    it('should return 42', function(done){
      var result = bot.run ("echo 42",User.users["Dave"],function (type,data){
        assert.equal("say 42",data);
        done();
      });
      if (result) {
        assert.equal("say 42",result);
        done();
      }
    })
  })
})
