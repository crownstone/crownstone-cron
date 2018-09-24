let util           = require('./util/util')
let scheduledTasks = require('./scheduledTasks')
let evaluate       = require('./execute')
let config      = require('./config/config.' + (process.env.NODE_ENV || 'local'));
const fetch        = require('node-fetch');

function hourlyInvoke() {

  let headers     = {'Content-Type': 'application/x-www-form-urlencoded'};
  let fetchConfig = {method: 'GET', headers};

  console.log("Starting...")
  util.promiseBatchPerformer(scheduledTasks, (task) => { return evaluate(task) })
    .then(() => {
      console.log("Ran successfully", err)
      fetch(config.snitchUrl + '?m="Success."', fetchConfig);
    })
    .catch((err) => {
      console.log("Failing with errors...", err)
      fetch(config.snitchUrl + '?m="Failed with errors."', fetchConfig);
    })

}

module.exports = hourlyInvoke;

