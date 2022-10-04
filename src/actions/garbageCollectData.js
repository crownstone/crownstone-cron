const fetch  = require('node-fetch');

let config = require('../config/config.' + (process.env.NODE_ENV || 'local'));

async function garbageCollectData() {
  console.log(new Date().valueOf() + " garbageCollectData: starting...");
  try {
    let result = await fetch(`https://next.crownstone.rocks/garbage-collect-data?token=${config.aggregationToken}`, {method: "GET"})
    let jsonResult = await result.text();
    console.log(new Date().valueOf() + " garbageCollectData: Successful garbage collection. " + jsonResult);
  }
  catch (err) {
    console.log(new Date().valueOf() + " garbageCollectData: something went wrong..." + err?.message);
  }
}


module.exports = garbageCollectData;
