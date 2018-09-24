let cleanActivityRanges  = require('./actions/cleanActivityRanges')
let cleanActivityLogs    = require('./actions/cleanActivityLogs')
let refreshToonSchedules = require('./actions/refreshToonSchedules')

let scheduledTasks = [
  {id:"activityRangeMaintenance", action: cleanActivityRanges,  everyNHours: "6" },
  {id:"activityLogMaintenance",   action: cleanActivityLogs,    everyNHours: "6" },
  {id:"toonSchedule",             action: refreshToonSchedules, everyNHours: "24"},
];


module.exports = scheduledTasks;
