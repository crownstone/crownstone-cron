let refreshToonSchedules = require('./actions/refreshToonSchedules')
let checkSseAndWebhooks  = require('./actions/checkSseAndWebhooks')
const sanitizeDatabase   = require("./actions/sanitizeDatabase");

let scheduledTasks = [
  {id:"sanitizeDatabase", action: sanitizeDatabase,     everyNHours: "12"},
  {id:"toonSchedule",     action: refreshToonSchedules, everyNHours: "24"},
  {id:"SSE+Webhooks",     action: checkSseAndWebhooks,  everyNHours: "1"},
];


module.exports = scheduledTasks;
