var _ = require("underscore");
var crmAPI = require('civicrm')(require('../../config.js').civicrm);
//crmAPI.init ( require('../config.js').civicrm);
function run(msg, user, callback) {
  var data = {};
  callback("partial","searching for "+msg+"...");
  crmAPI.get ('contact',{sort_name:this.param(msg),contact_type:'Individual',return:'display_name,email,phone'},
  function (result) {

    function format (contact) {
      return contact.display_name+ " "+(contact.email || "") + " "+ (contact.phone || "");
    };

    data.contacts = result.values;
    user.addContextual (require("./search.number.js")(data.contacts));
    data.text = "";
    for (var i in result.values) {
      val = result.values[i];
      data.text = data.text +"\n"+i +": "+ format (val);
    }
    _.delay(function(){
      callback("question","Type a number (between 0 and "+ (data.contacts.length -1) +") to view more info");
    }, 800);
    callback("partial",data);
  });
}

module.exports = function(bot){return {run: run}}
