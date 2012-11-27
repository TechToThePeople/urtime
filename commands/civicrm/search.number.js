var crmAPI = require('civicrm')(require('../../config.js').civicrm);

var trigger= function(msg, user) {
  return !isNaN(parseFloat(msg)) && isFinite(msg);
} 

function run (index, user,callback) {
  callback("info",this.contacts[index].display_name);
  crmAPI.get ('phone',{contact_id:this.contacts[index].contact_id},function (result){
    result.text ="";
    for (var i in result.values) {
      val = result.values[i];
      result.text = result.text +"\n"+val.phone;
    }
    callback("info",result);
  });

}

module.exports = function(contacts) {return {contacts:contacts, trigger:trigger, contextual:true, name:"number create task", run: run}}

