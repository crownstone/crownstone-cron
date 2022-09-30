const fetch  = require('node-fetch');

let config = require('../config/config.' + (process.env.NODE_ENV || 'local'));

async function sanitizeDatabase() {
  console.log(new Date().valueOf() + " SanitizeDatabase: starting...");
  try {
    let result = await fetch(`https://next.crownstone.rocks/sanitize-database?token=${config.sanitationToken}`, {method: "GET"})
    let jsonResult = await result.text();
    console.log(new Date().valueOf() + " SanitizeDatabase: Successful sanitation. " + jsonResult);
  }
  catch (err) {
    console.log(new Date().valueOf() + " SanitizeDatabase: something went wrong..." + err?.message);
  }
}


module.exports = sanitizeDatabase;
