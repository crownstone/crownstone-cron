let util           = require('./util/util');
let scheduledTasks = require('./scheduledTasks');
let evaluate       = require('./execute');

const headers        = {'Content-Type': 'application/x-www-form-urlencoded'};
const fetchConfig    = {method: 'GET', headers};
const fetch        = require('node-fetch');

let config = require('./config/config.' + (process.env.NODE_ENV || 'local'));

const MongoDbConnector = require("./MongoDbConnector");


async function Invoke(forceExecute = false) {
  console.log(new Date().valueOf() + " Starting...", new Date().valueOf());
  runTasks(forceExecute);
}


async function runTasks(forceExecute) {
  let mongo = new MongoDbConnector(config.cronMongo.url, config.cronMongo.name);

  await mongo.connect();

  console.log(new Date().valueOf() + " Connected...", new Date().valueOf())

  try {
    // run all tasks one by one.
    for (let task of scheduledTasks) {
      let lastExecution = await getLastExecutionForAction(mongo, task.id);
      let id   = lastExecution.length > 0 ? lastExecution[0]._id : null;
      let time = lastExecution.length > 0 ? lastExecution[0].lastExecution : 0;

      let didExecute = await evaluate(task, time, forceExecute);

      if (didExecute) {
        await setExecutionTime(mongo, id, task.id, new Date().valueOf());
      }
    }
    console.log(new Date().valueOf() + " Ran successfully")
    await fetch(config.snitchUrl + '?m=Successful', fetchConfig);
  }
  catch (err) {
    console.log(new Date().valueOf() + " Failing with errors")
    console.log(err)
    await fetch(config.snitchUrl + '?m=Failed', fetchConfig);
  }
  finally {
    mongo.close();
  }
  console.log(new Date().valueOf() + " Shutting down logger");
  process.exit();
}

// dataformat:
// interface execution {
//   id: string,
//   name: string;
//   lastExecution: Date;
// }




function getLastExecutionForAction(mongo, name) {
  return new Promise((resolve, reject) => {
    let executions = mongo.db.collection("executions");
    executions.find({name: name}).toArray(async (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

function setExecutionTime(mongo, id, name, timestamp) {
  let executions = mongo.db.collection("executions");
  if (id !== null) {
    return executions.updateOne(
      {_id: id},
      {$set: {
          name: name,
          lastExecution: timestamp,
        }
      })
  }
  else {
    let data = {
      name: name,
      lastExecution: timestamp,
    }
    return executions.insert(data);
  }
}

module.exports = Invoke;

