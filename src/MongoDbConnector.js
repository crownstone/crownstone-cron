const MongoClient = require('mongodb').MongoClient;

class MongoDbConnector {

  constructor(url, name) {
    this.url = url;
    this.name = name;

    this.db = null;
    this.mongoClient = null;
  }

  connect() {
    return new Promise((resolve, reject) => {

      // Use connect method to connect to the server
      MongoClient.connect(this.url, {useNewUrlParser:true}, (err, client) => {
        if ( err ) { return reject(err); }

        console.log(new Date().valueOf() + " ScheduledJob: Connected successfully to mongo server");

        this.db = client.db(this.name);

        this.mongoClient = client;
        resolve();
      });
    })
  }

  close() {
    return this.mongoClient.close();
  }
}


module.exports = MongoDbConnector;
