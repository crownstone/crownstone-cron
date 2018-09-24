let MongoDbConnector = require('./MongoDbConnector');
let config           = require('./config/config.' + (process.env.NODE_ENV || 'local'));
const fetch          = require('node-fetch');

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
      console.log("Executing task:", task.id);
      fetch(config.snitchUrl + '?m="Executing:' + task.id + '"', fetchConfig);
      execute(task).then(() => { resolve() })
    }
    else {
      console.log("Skipping task:", task.id);
      fetch(config.snitchUrl + '?m="Skipping:' + task.id + '"', fetchConfig);
      resolve();
    }
  })

}




module.exports = evaluate;
