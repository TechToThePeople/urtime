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

  // Read input file
  try {
    fileContents = fs.readFileSync(filename).toString();
  }
  catch (e) {
    // File doesn't exist. Create new.
    timesheet.parse('')
    return timesheet
  }

  // Parse some more data.
  // TODO: Error handling on wrong format.
  try {
    timesheet.parse(fileContents);
  }
  catch (e) {
    // File is corrupt.
    console.log('Corrupt timesheet file "' + filename + '".')
    throw e
  }

  return timesheet
}


function UserTimesheet(filename) {

  var timesheet = createStnTimesheet(filename)

  function save() {
    var newFileContents = timesheet.toString()
    console.log(newFileContents)
    fs.writeFile(filename, newFileContents, 'utf-8', function(err){
      if (err) throw err
      console.log('Timesheet saved to "' + filename + '".')
    })
  }

  this.addInterval = function(start, end, task, comment) {
    timesheet.addEntry({
      date: end,
      start: start,
      end: end,
      tags: [task],
      notes: comment
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

  this.getAsText = function() {
    return timesheet.toString()
  }

  this.getTimeSlotsForTask = function(task) {
    var tree = timesheet.parse_tree
    var filtered = {}
    for (var date in tree) {
      for (var time in tree[date]) {
        
      }
    }
    return messages
  }
}


/**
 * Create the timesheet for a given username
 */
function createForUsername(username) {
  var filename = 'data/timesheet/' + username + '.txt'
  return new UserTimesheet(filename)
}


exports.createForUsername = createForUsername
