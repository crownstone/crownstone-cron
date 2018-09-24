let MongoDbConnector = require('./MongoDbConnector');

function execute(task) {
  console.log("ScheduledJob: Setting up execution of", task.id, "...");
  let mongo = new MongoDbConnector();
  return mongo.connect()
    .then(() => {
      console.log("ScheduledJob: Executing:", task.id);
      return task.action(mongo);
    })
    .then(() => {
      console.log("ScheduledJob: Finished:", task.id);
      mongo.close();
    })
    .catch((err) => {
      console.log("ScheduledJob: Failed:", task.id, err);
      mongo.close();
    })
}

function evaluate(task, forceExecute = false) {
  return new Promise((resolve, reject) => {
    let everyNHours = task.everyNHours;
    let now = new Date().valueOf();
    let timeSinceLastTrigger = (now % (everyNHours*3600000))

    if (timeSinceLastTrigger < 3600000 || forceExecute) {
      execute(task).then(() => { resolve() })
    }
    else {
      resolve();
    }
  })

}




module.exports = evaluate;
