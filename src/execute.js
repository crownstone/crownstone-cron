let MongoDbConnector = require('./MongoDbConnector');
let config           = require('./config/config.' + (process.env.NODE_ENV || 'local'));
const fetch          = require('node-fetch');

let Logger = require('le_node');
let logger = new Logger({ token: config.logEntries, console: true, minLevel: 1 });

function execute(task) {
  logger.info("ScheduledJob: Setting up execution of " +  task.id + "...");
  let mongo = new MongoDbConnector();
  return mongo.connect()
    .then(() => {
      logger.info("ScheduledJob: Executing: " + task.id);
      return task.action(mongo);
    })
    .then(() => {
      logger.info("ScheduledJob: Finished: "+ task.id);
      mongo.close();
    })
    .catch((err) => {
      logger.err("ScheduledJob: Failed: " + task.id);
      logger.err(err);
      mongo.close();
    })
}

function evaluate(task, forceExecute = false) {
  return new Promise((resolve, reject) => {
    let everyNHours = task.everyNHours;
    let now = new Date().valueOf();
    let timeSinceLastTrigger = (now % (everyNHours*3600000))

    if (timeSinceLastTrigger < 3600000 || forceExecute) {
      logger.info("Executing task: " + task.id);
      execute(task).then(() => { resolve() })
    }
    else {
      logger.info("Skipping task: " + task.id);
      resolve();
    }
  })

}




module.exports = evaluate;
