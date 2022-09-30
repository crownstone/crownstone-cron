const fetch  = require('node-fetch');

let config = require('../config/config.' + (process.env.NODE_ENV || 'local'));

async function aggregateEnergyData() {
  console.log(new Date().valueOf() + " aggregateEnergyData: starting...");
  try {
    let result = await fetch(`https://next.crownstone.rocks/aggregate-energy-data?token=${config.aggregationToken}`, {method: "GET"})
    let jsonResult = await result.text();
    console.log(new Date().valueOf() + " aggregateEnergyData: Successful aggregation. " + jsonResult);
  }
  catch (err) {
    console.log(new Date().valueOf() + " aggregateEnergyData: something went wrong..." + err?.message);
  }
}


module.exports = aggregateEnergyData;
