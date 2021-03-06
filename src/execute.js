let MongoDbConnector = require('./MongoDbConnector');
let config           = require('./config/config.' + (process.env.NODE_ENV || 'local'));
const fetch          = require('node-fetch');

const logger = require("./loggerInstance")

function execute(task) {
  logger.info(new Date().valueOf() + " ScheduledJob: Setting up execution of " +  task.id + "...");
  let mongo = new MongoDbConnector();
  return mongo.connect()
    .then(() => {
      logger.info(new Date().valueOf() + " ScheduledJob: Executing: " + task.id);
      return task.action(mongo);
    })
    .then(() => {
      logger.info(new Date().valueOf() + " ScheduledJob: Finished: "+ task.id);
      return mongo.close();
    })
    .catch((err) => {
      logger.err(new Date().valueOf() + " ScheduledJob: Failed: " + task.id);
      logger.err(err);
      return mongo.close();
    })
}

function evaluate(task, forceExecute = false) {
  return new Promise((resolve, reject) => {
    let everyNHours = task.everyNHours;
    let now = new Date().valueOf();
    let timeSinceLastTrigger = (now % (everyNHours*3600000))

    if (timeSinceLastTrigger < 3600000 || forceExecute) {
      logger.info(new Date().valueOf() + " Executing task: " + task.id);
      execute(task).then(() => { resolve() })
    }
    else {
      logger.info(new Date().valueOf() + " Skipping task: " + task.id);
      resolve();
    }
  })

}




module.exports = evaluate;
