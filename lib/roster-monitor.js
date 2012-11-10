


/**
 * The RosterMonitor updates the roster in fixed intervals
 *
 * @param iqEngine
 *   engine that can tell us about the roster
 * @param int interval
 *   Interval in milliseconds
 */
function RosterMonitor(iqEngine, interval) {

  var roster = {}

  function updateRoster(contacts) {
    console.log('--- roster ---')
    console.log(contacts)
  }

  function onInterval() {
    iqEngine.getRoster(updateRoster)
  }

  
}



exports.RosterMonitor = RosterMonitor
