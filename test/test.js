var assert = require("chai").assert;

var conf = require('../config.js');
var User = require('../lib/user.js').User;
var Bot = require ('../lib/bot.js').Bot;

var bot = new Bot({'name':'web',
commandGroups:conf.commandGroups,
});

User.connect("Dave", function(greeting){});

describe('Command', function(){
  describe('#help', function(){
    it('should return a list of command names', function(done){
      var result = bot.run ("help",User.users["Dave"],function (type,data){
        assert.typeOf(data,'string',data);
        done();
      });
      assert.typeOf(result,'string',result);
      done();
    })
  })
  describe('#search', function(){
    it('should return something', function(done){
      var result = bot.run ("search a",User.users["Dave"],function (type,data){
//console.log(type);
console.type(data);
//        assert.typeOf(data.count,'number');
        assert.equal(0,data.is_error,data.error_essage);
        done();
      });
    })
  })
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
