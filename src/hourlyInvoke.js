let util           = require('./util/util')
let scheduledTasks = require('./scheduledTasks')
let evaluate       = require('./execute')

function hourlyInvoke() {

  console.log("Starting...")
  util.promiseBatchPerformer(scheduledTasks, (task) => { return evaluate(task) })
    .then(() => {
      console.log("Ran successfully")
    })
    .catch((err) => {
      console.log("Failing with errors...", err)
    })

}

module.exports = hourlyInvoke;

