let util           = require('./util/util')
let scheduledTasks = require('./scheduledTasks')
let evaluate       = require('./execute')
let headers        = {'Content-Type': 'application/x-www-form-urlencoded'};
let fetchConfig    = {method: 'GET', headers};

let config = require('./config/config.' + (process.env.NODE_ENV || 'local'));

let Logger = require('le_node');
let logger = new Logger({ token: config.logEntries });

function hourlyInvoke() {
  logger.info("Starting...", new Date().valueOf())
  util.promiseBatchPerformer(scheduledTasks, (task) => { return evaluate(task) })
    .then(() => {
      logger.info("Ran successfully")
      fetch(config.snitchUrl + '?m=Successful', fetchConfig);
    })
    .catch((err) => {
      logger.info("Failing with errors...", err)
      fetch(config.snitchUrl + '?m=Failed', fetchConfig);
    })

}

module.exports = hourlyInvoke;

