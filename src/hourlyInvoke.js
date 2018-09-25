let util           = require('./util/util');
let scheduledTasks = require('./scheduledTasks');
let evaluate       = require('./execute');

const headers        = {'Content-Type': 'application/x-www-form-urlencoded'};
const fetchConfig    = {method: 'GET', headers};
const fetch        = require('node-fetch');

let config = require('./config/config.' + (process.env.NODE_ENV || 'local'));

const logger = require("./loggerInstance")

function hourlyInvoke() {
  logger.info("Starting...", new Date().valueOf())
  logger.once('connected', () => {
    logger.info("Connected...", new Date().valueOf())
    util.promiseBatchPerformer(scheduledTasks, (task) => {
      return evaluate(task)
    })
      .then(() => {
        logger.info("Ran successfully")
        fetch(config.snitchUrl + '?m=Successful', fetchConfig);
      })
      .catch((err) => {
        console.log(err)
        logger.err("Failing with errors")
        logger.err(err)
        fetch(config.snitchUrl + '?m=Failed', fetchConfig);
      })
      .then(() => {
        logger.once('buffer drain', () => {
          logger.closeConnection();
          logger.on('disconnected', () => {
            process.exit();
          });
        });
      })
  })

  logger.once('error', (err) => {
    console.log("error", err)
  })

  logger.once('disconnected', (err) => {
    console.log("disconnected")
  })

 logger.once('timed out', (err) => {
    console.log("timed out", err)
  })

}

module.exports = hourlyInvoke;

