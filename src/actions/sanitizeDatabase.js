const logger = require("../loggerInstance")
const fetch  = require('node-fetch');

let config = require('../config/config.' + (process.env.NODE_ENV || 'local'));

async function sanitizeDatabase() {
  logger.info(new Date().valueOf() + " SanitizeDatabase: starting...");
  try {
    let result = await fetch(`https://next.crownstone.rocks/sanitize-database?token=${config.sanitationToken}`, {method: "GET"})
    let jsonResult = await result.text();
    logger.info(new Date().valueOf() + " SanitizeDatabase: Successful sanitation. " + jsonResult);
  }
  catch (err) {
    logger.info(new Date().valueOf() + " SanitizeDatabase: something went wrong..." + err?.message);
  }
}


module.exports = sanitizeDatabase;
