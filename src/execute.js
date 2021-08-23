let MongoDbConnector = require('./MongoDbConnector');

const logger = require("./loggerInstance");

let hourMs = 3600*1000;

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
      mongo.close();

      throw err;
    })
}

async function evaluate(task, executionIntervalMins, forceExecute = false) {
  let intervalMs = executionIntervalMins * 60 * 1000;

  let everyNHours = task.everyNHours;
  let now = new Date().valueOf();
  let timeSinceLastTrigger = (now % (everyNHours*hourMs));

  // if the time since the last trigger is smaller or equal than the interval of the invocation
  // that means that this is the invocation that will execute the task.
  if (timeSinceLastTrigger <= intervalMs || forceExecute) {
    logger.info(new Date().valueOf() + " Executing task: " + task.id);
    await execute(task)
  }
  else {
    logger.info(new Date().valueOf() + " Skipping task: " + task.id);
  }
}




module.exports = evaluate;
