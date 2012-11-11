/**
 * Storage of timetracking data
 */

/*jslint devel: true, node: true, maxerr: 50, indent: 4,  vars: true, sloppy: true */
var fs = require('fs')
  , util = require('util')
  , stn = require('stn')


var stnOptions = {
  normalize_date: true,
  hours: true,
  tags: true
}


function stnReadFileSync(filename, fallback) {
  try {
    var fileContents = fs.readFileSync(filename)
  }
  catch (e) {
    // File does not exist, start new.
    console.log('could not read')
    return stn.parse('')
  }
  try {
    return stn.parse(fileContents, stnOptions) || fallback
  }
  catch (e) {
    console.log('could not parse')
    return stn.parse('')
  }
}


function UserTimesheet(filename) {

  var data = stnReadFileSync(filename)

  function save() {
    // TODO: How to convert back to fileContents string?
    console.log('how do we save the timesheet?')
  }

  this.addInterval = function(start, end, task, comment) {
    // TODO: How to add an interval.
    // (we need to return something, so the punchout command doesn't end with
    // a weird comment)
    return true
  }

  this.addComment = function(time, comment) {
    // TODO: How to add a comment.
  }
}


/**
 * Create the timesheet for a given username
 */
function createForUsername(username) {
  var filename = '/var/projects/knockout/tttp/data/timesheet/' + username + '.txt'
  return new UserTimesheet(filename)
}


exports.createForUsername = createForUsername
