const logger = require("../loggerInstance")


async function sanitizeDatabase() {
  logger.info(new Date().valueOf() + " SanitizeDatabase: starting...");
  try {
    let result = await fetch(`https://next.crownstone.rocks/sanitize-database?token=${process.env.SANITATION_TOKEN}`, {method: "GET"})
    let jsonResult = await result.json();
    logger.info(new Date().valueOf() + " SanitizeDatabase: Successful sanitation. " + JSON.stringify(jsonResult, null, 2));
  }
  catch (err) {
    logger.info(new Date().valueOf() + " SanitizeDatabase: something went wrong..." + err?.message);
  }
}


module.exports = sanitizeDatabase;
