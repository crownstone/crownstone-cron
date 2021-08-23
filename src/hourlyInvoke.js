let util           = require('./util/util');
let scheduledTasks = require('./scheduledTasks');
let evaluate       = require('./execute');

const headers        = {'Content-Type': 'application/x-www-form-urlencoded'};
const fetchConfig    = {method: 'GET', headers};
const fetch        = require('node-fetch');

let config = require('./config/config.' + (process.env.NODE_ENV || 'local'));

const logger = require("./loggerInstance")

async function hourlyInvoke(forceExecute = false) {
  logger.info(new Date().valueOf() + " Starting...", new Date().valueOf());
  logger.once('connected',    ()    => { runTasks(60, forceExecute);});
  logger.once('error',        (err) => { console.log("error", err);     });
  logger.once('disconnected', (err) => { console.log("disconnected");   });
  logger.once('timed out',    (err) => { console.log("timed out", err); });
}

async function runTasks(invocationIntervalMins, forceExecute) {
  logger.info(new Date().valueOf() + " Connected...", new Date().valueOf())

  try {
    // run all tasks one by one.
    for (let task of scheduledTasks) {
      await evaluate(task, invocationIntervalMins, forceExecute);
    }

    logger.info(new Date().valueOf() + " Ran successfully")
    await fetch(config.snitchUrl + '?m=Successful', fetchConfig);
  }
  catch (err) {
    logger.info(new Date().valueOf() + " Failing with errors")
    logger.info(err)
    await fetch(config.snitchUrl + '?m=Failed', fetchConfig);
  }

  logger.info(new Date().valueOf() + " Shutting down logger");
  logger.notice({ type: 'server', event: 'shutdown' });
  logger.once('buffer drain', () => {
    logger.closeConnection();
    logger.on('disconnected', () => {
      process.exit();
    });
  });
}

module.exports = hourlyInvoke;

