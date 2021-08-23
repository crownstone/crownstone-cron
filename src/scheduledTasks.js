let refreshToonSchedules = require('./actions/refreshToonSchedules')
let checkSseAndWebhooks  = require('./actions/checkSseAndWebhooks')

let scheduledTasks = [
  {id:"toonSchedule", action: refreshToonSchedules, everyNHours: "24"},
  {id:"SSE+Webhooks", action: checkSseAndWebhooks,  everyNHours: "1"},
];


module.exports = scheduledTasks;
