const Util = require("../util/util")
const ToonAPI = require("../util/toon/Toon")
const logger = require("../loggerInstance")

function refreshToonSchedules(mongo) {
  let toonCollection = mongo.dataDb.collection("Toon");
  return new Promise((resolveAll, rejectAll) => {
    toonCollection.find({}).toArray((err, toons) => {
      return Util.promiseBatchPerformer(toons, (toon) => {
        return new Promise((resolve, reject) => {
          let tokens = null
          ToonAPI.getAccessToken(toon.refreshToken)
            .then((receivedTokens) => {
              tokens = receivedTokens;
              return ToonAPI.getSchedule(mongo, tokens, toon.toonAgreementId);
            })
            .then((schedule) => {
              return toonCollection.updateOne(
                { _id: toon._id},
                { refreshToken: tokens.refreshToken, schedule: JSON.stringify(schedule), updatedScheduleTime: new Date().valueOf() },
                ( err, result ) => {
                  resolve();
                }
              );
            })
            .catch((err) => {
              logger.info("ToonScheduledJob: Failed to execute: " + toon._id);
              resolve();
            })
        })
      })
        .then(() => {
          resolveAll();
        })

    })
  })

}


module.exports = refreshToonSchedules;
