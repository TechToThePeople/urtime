var crmAPI = require('civicrm')(require('../config.js').civicrm);
//crmAPI.init ( require('../config.js').civicrm);
function run(msg, user, callback) {
  var data = {};
  crmAPI.get ('contact',{sort_name:this.param(msg),contact_type:'Individual',return:'display_name,email,phone'},
  function (result) {
    data.contacts = result.values;
    data.text = "";
    for (var i in result.values) {
      val = result.values[i];
      data.text = data.text +"\n"+val.id +": "+val.display_name+ " "+val.email+ " "+ val.phone;
    }
    callback("info",data);
  });
}

module.exports = function(bot){return {run: run}}
