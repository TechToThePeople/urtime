var crmAPI = require('civicrm')(require('../../config.js').civicrm);

function run (index, user,callback) {
  var phone = this.param(msg);
console.log(phone);
  callback("error","missing phone number to add. syntax: add phone {+41 22 123 345 67} ");

  callback("partial","adding phone "+ phone+ " to "+this.contacts[index].display_name);
  crmAPI.create ('phone',{contact_id:this.contacts[index].contact_id},function (result){
    result.text ="";
console.log(result);
    for (var i in result.values) {
      val = result.values[i];
      result.text = result.text +"\n"+val.phone;
    }
    callback("success",result);
  });

}

module.exports = function(contacts) {return {contacts:contacts, contextual:true, name:"add phone", run: run}}

