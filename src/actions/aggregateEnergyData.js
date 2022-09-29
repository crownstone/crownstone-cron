const logger = require("../loggerInstance")
const fetch  = require('node-fetch');

let config = require('../config/config.' + (process.env.NODE_ENV || 'local'));

async function aggregateEnergyData() {
  logger.info(new Date().valueOf() + " aggregateEnergyData: starting...");
  try {
    let result = await fetch(`https://next.crownstone.rocks/aggregate-energy-data?token=${config.aggregationToken}`, {method: "POST"})
    let jsonResult = await result.text();
    logger.info(new Date().valueOf() + " aggregateEnergyData: Successful aggregation. " + jsonResult);
  }
  catch (err) {
    logger.info(new Date().valueOf() + " aggregateEnergyData: something went wrong..." + err?.message);
  }
}


module.exports = aggregateEnergyData;
