module.exports = {
  mongoDs: {
    "connector": "loopback-connector-mongodb",
    "name": process.env.DATA_TABLE,
    "url": "mongodb://" + process.env.MONGODB_USER + ":"
      + process.env.MONGODB_PASSWORD + "@"
      + process.env.MONGODB_HOST + ":"
      + process.env.MONGODB_PORT + "/"
      + process.env.DATA_TABLE + "?authSource=admin&ssl=true&sslValidate=false",
  },
  userDs: {
    "connector": "loopback-connector-mongodb",
    "name": process.env.USER_TABLE,
    "url": "mongodb://" + process.env.MONGODB_USER + ":"
      + process.env.MONGODB_PASSWORD + "@"
      + process.env.MONGODB_HOST + ":"
      + process.env.MONGODB_PORT + "/"
      + process.env.USER_TABLE + "?authSource=admin&ssl=true&sslValidate=false",
  },
  filesDs: {
    "connector": "loopback-component-storage-gridfs",
    "name": process.env.FILES_TABLE,
    "url": "mongodb://" + process.env.MONGODB_USER + ":"
      + process.env.MONGODB_PASSWORD + "@"
      + process.env.MONGODB_HOST + ":"
      + process.env.MONGODB_PORT + "/"
      + process.env.FILES_TABLE + "?authSource=admin&ssl=true&sslValidate=false",
  },
  ToonIntegration: {
    clientId:     process.env.TOON_CLIENT_ID,
    clientSecret: process.env.TOON_CLIENT_SECRET
  },
  snitchUrl:  process.env.SNITCH_URL,
  logEntries: process.env.LOG_ENTRIES_TOKEN,

  crownstoneUsername:  process.env.CROWNSTONE_USERNAME,
  crownstonePassword:  process.env.CROWNSTONE_PASSWORD,
  virtualCrownstoneId: process.env.VIRTUAL_CROWNSTONE_ID,

  hooksApiKey: process.env.WEBHOOK_API_KEY,
  hostname:    process.env.HOST_NAME,
  port:        process.env.PORT,
  waitTime:    Number(process.env.HOOK_WAIT_TIME),
};