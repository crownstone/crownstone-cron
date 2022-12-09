const refreshToonSchedules = require('./actions/refreshToonSchedules')
const checkSseAndWebhooks  = require('./actions/checkSseAndWebhooks')
const sanitizeDatabase   = require("./actions/sanitizeDatabase");
const aggregateEnergyData   = require("./actions/aggregateEnergyData");
const garbageCollectData   = require("./actions/garbageCollectData");

let scheduledTasks = [
  {id:"garbageCollectData",   action: garbageCollectData,   local:true,  everyNHours: "1"},
  {id:"aggregateEnergyUsage", action: aggregateEnergyData,  local:true,  everyNHours: "0.5"},
  {id:"sanitizeDatabase",     action: sanitizeDatabase,     local:true,  everyNHours: "12"},
  {id:"toonSchedule",         action: refreshToonSchedules, local:true,  everyNHours: "24"},
  {id:"SSE+Webhooks",         action: checkSseAndWebhooks,  local:false, everyNHours: "1"},
];


module.exports = scheduledTasks;
