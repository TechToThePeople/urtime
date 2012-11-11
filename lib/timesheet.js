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


function createStnTimesheet(filename) {

  var timesheet = new stn.Stn()

  // Set to save_parse = true, normalize_date = true, tags = true
  timesheet.reset();

  // Read in the initial data set
  fileContents = fs.readFileSync(filename).toString();

  // Parse some more data.
  // TODO: Error handling on wrong format.
  timesheet.parse(fileContents);

  return timesheet
}


function UserTimesheet(filename) {

  var timesheet = createStnTimesheet(filename)

  function save() {
    var newFileContents = timesheet.toString()
    console.log(newFileContents)
  }

  this.addInterval = function(start, end, task, comment) {
    timesheet.addEntry({
      date: end,
      start: start,
      end: end,
      // tags: [],
      notes: comment,
      // TODO: Seems like their "project" is our "task". Are we sure?
      project: task
    });
    save()
    // We return something to be used in messages
    return {
      duration: end - start
    }
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
