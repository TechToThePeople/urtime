var _ = require("underscore");
var crmAPI = require('civicrm')(require('../../config.js').civicrm);
//crmAPI.init ( require('../config.js').civicrm);
function run(msg, user, callback) {
  var data = {};
  callback("partial","create for "+msg+"...");
  crmAPI.create ('contact',{sort_name:this.param(msg),contact_type:'Individual',return:'display_name,email,phone'},
  function (result) {
console.log(result);
  });


/*    _.delay(function(){
      callback("question","Type a number (between 0 and "+ (data.contacts.length -1) +") to view more info");
    }, 800);
    callback("partial",data);
*/
}

module.exports = function(bot){return {run: run}}
