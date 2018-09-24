let util           = require('./util/util')
let scheduledTasks = require('./scheduledTasks')
let evaluate       = require('./execute')
const fetch        = require('node-fetch');


let config      = require('./config/config.' + (process.env.NODE_ENV || 'local'));
let headers     = {'Content-Type': 'application/x-www-form-urlencoded'};
let fetchConfig = {method: 'GET', headers};

util.promiseBatchPerformer(scheduledTasks, (task) => { return evaluate(task, true) })
  .then(() => {
    fetch(config.snitchUrl + '?m="Success."', fetchConfig);
  })
  .catch((err) => {
    fetch(config.snitchUrl + '?m="Failed with errors."', fetchConfig);
  })