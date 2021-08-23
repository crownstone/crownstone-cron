const Util = require("../util/util")
const ToonAPI = require("../util/toon/Toon")
const logger = require("../loggerInstance")

function getToons(mongo) {
  return new Promise((resolve, reject) => {
    let toonCollection = mongo.dataDb.collection("Toon");
    toonCollection.find({}).toArray(async (err, toons) => {
      if (err) {
        return reject(err);
      }
      resolve(toons);
    });
  });
}

function updateCollection(mongo, filter, update) {
  return new Promise((resolve, reject) => {
    let toonCollection = mongo.dataDb.collection("Toon");
    toonCollection.updateOne(
      filter,
      update,
      ( err, result ) => {
        if (err) {
          logger.info(new Date().valueOf() + " ToonScheduledJob: ERROR DURING job: " + toon._id);
          return reject(err);
        }
        resolve();
      }
    );
  });
}

async function refreshToonSchedules(mongo) {
  let toons = await getToons(mongo);
  for (let toon of toons) {
    try {
      let tokens   = await ToonAPI.getAccessToken(toon.refreshToken);
      let schedule = await ToonAPI.getSchedule(mongo, tokens, toon.toonAgreementId);
      await updateCollection(mongo,{ _id: toon._id}, { $set: {
          refreshToken            : tokens.refreshToken,
          refreshTokenTTL         : tokens.refreshTokenTTL,
          refreshTokenUpdatedAt   : tokens.refreshTokenUpdatedAt,
          refreshTokenUpdatedFrom : tokens.refreshTokenUpdatedFrom + "_refreshToonSchedules",
          schedule: JSON.stringify(schedule),
          updatedScheduleTime: new Date().valueOf()
        }
      })
      logger.info(new Date().valueOf() + " ToonScheduledJob: Finished job: " + toon._id);
    }
    catch (err) {
      logger.info(new Date().valueOf() + " ToonScheduledJob: Failed to execute: " + toon._id);
      console.log("ERR; ToonScheduledJob: ",err)
    }
  }
}


module.exports = refreshToonSchedules;
