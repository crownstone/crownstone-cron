const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let config = require('./config/config.' + (process.env.NODE_ENV || 'local'));

let Logger = require('le_node');
let logger = new Logger({ token: config.logEntries });

class MongoDbConnector {

  constructor() {
    this.userDb = null;
    this.dataDb = null;
    this.mongoClient = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      let url = config.mongoDs.url;

      // Use connect method to connect to the server
      MongoClient.connect(url, (err, client) => {
        if ( err ) { return reject(err); }

        logger.info("ScheduledJob: Connected successfully to mongo server");

        this.userDb = client.db(config.userDs.name);
        this.dataDb = client.db(config.mongoDs.name);

        this.mongoClient = client;
        resolve();
      });
    })
  }

  close() {
    this.mongoClient.close();
  }
}


module.exports = MongoDbConnector;
