const logger = require("./loggerInstance");

let hourMs = 3600*1000;

async function execute(task) {
  logger.info(new Date().valueOf() + " ScheduledJob: Setting up execution of " +  task.id + "...");
  logger.info(new Date().valueOf() + " ScheduledJob: Executing: " + task.id);
  try {
    await task.action()
    logger.info(new Date().valueOf() + " ScheduledJob: Finished: "+ task.id);
  }
  catch (err) {
      logger.err(new Date().valueOf() + " ScheduledJob: Failed: " + task.id);
      logger.err(err);
      throw err;
  }
}

async function evaluate(task, lastInvocation, forceExecute = false) {
  let everyNHours = task.everyNHours;

  let diff = new Date().valueOf() - lastInvocation;
  if (diff > everyNHours * hourMs || forceExecute) {
    logger.info(new Date().valueOf() + " Executing task: " + task.id);
    await execute(task);
    return true;
  }
  else {
    logger.info(new Date().valueOf() + " Skipping task: " + task.id);
    return false;
  }
}




module.exports = evaluate;
