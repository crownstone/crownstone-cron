const refreshToonSchedules = require('./actions/refreshToonSchedules')
const checkSseAndWebhooks  = require('./actions/checkSseAndWebhooks')
const sanitizeDatabase   = require("./actions/sanitizeDatabase");
const aggregateEnergyData   = require("./actions/aggregateEnergyData");
const garbageCollectData   = require("./actions/garbageCollectData");

let scheduledTasks = [
  {id:"garbageCollectData",   action: garbageCollectData,   everyNHours: "1"},
  {id:"aggregateEnergyUsage", action: aggregateEnergyData,  everyNHours: "0.5"},
  {id:"sanitizeDatabase",     action: sanitizeDatabase,     everyNHours: "12"},
  {id:"toonSchedule",         action: refreshToonSchedules, everyNHours: "24"},
  {id:"SSE+Webhooks",         action: checkSseAndWebhooks,  everyNHours: "1"},
];


module.exports = scheduledTasks;
