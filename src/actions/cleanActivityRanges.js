function cleanActivityRanges(mongo) {
  let activityRangesCollection = mongo.dataDb.collection("ActivityRange");

  let thresholdTime = new Date().valueOf() - 1*24*3600*1000;
  
  return activityRangesCollection.deleteMany({"$or": [
    {"$and": [{lastDirectTime: { "$lt":thresholdTime }}, { lastMeshTime:   null}]},
    {"$and": [{lastMeshTime:   { "$lt":thresholdTime }}, { lastDirectTime: null}]},
    {"$and": [{lastDirectTime: { "$lt":thresholdTime }}, { lastMeshTime:   { "$lt":thresholdTime }}]},
  ]});

  // t1 = null && t2 < t
  // t1 < t && t2 = null
  // t1 < t && t2 < t
}


module.exports = cleanActivityRanges;
