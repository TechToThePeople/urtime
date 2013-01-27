var crmAPI = require('civicrm')(require('../../config.js').civicrm);

var trigger= function(msg, user) {
  return !isNaN(parseFloat(msg)) && isFinite(msg);
} 

function run (index, user,callback) {
  user.addContextual (require("./add.phone.js")(this.contacts[index]));
//  user.addContextual (require("./add.email.js")(this.contacts[index]),false);
//  user.addContextual (require("./add.employer.js")(this.contacts[index]),false);
console.log(this.contacts[index]);
  callback("partial",this.contacts[index].display_name);
  crmAPI.get ('phone',{contact_id:this.contacts[index].contact_id},function (result){
    result.text ="";
    for (var i in result.values) {
      val = result.values[i];
      result.text = result.text +"\n"+val.phone;
    }
    callback("success",result);
  });

}

module.exports = function(contacts) {return {contacts:contacts, trigger:trigger, contextual:true, name:"number create task", run: run}}

