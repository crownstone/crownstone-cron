const express = require("express");
const bodyParser = require("body-parser");

let config = require('../config/config.' + (process.env.NODE_ENV || 'local'));

class ExpressServer {

  app
  server
  checker

  memory = [];

  constructor(checker) {
    this.checker = checker
  }

  run(checker) {
    return new Promise((resolve, reject) => {
      this.app = express();
      this.app.use( bodyParser.json() );       // to support JSON-encoded bodies
      this.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
      }));

      this.app.post('/hook', (req, res) => {
        this.memory.push(req.body);
        res.end(JSON.stringify({status:204}));
      })
      this.app.post('/wake', (req, res) => {
        this.memory = []
        res.end(JSON.stringify({status:204}));
      })
      this.app.post('/reset', (req, res) => {
        this.memory = []
        res.end(JSON.stringify({status:204}));
      })
      this.app.get('/results', (req, res) => {
        res.end(JSON.stringify({status:200, res: this.memory}));
      })


      this.app.set('port', (config.port));

      this.server = this.app.listen(this.app.get('port'), () => {
        console.log('Node app is running on port', this.app.get('port'));
        resolve();
      });
    })
  }

  shutdown() {
    return new Promise((resolve, reject) => {
      this.server.close(() => { resolve(); });
    });
  }
}

module.exports = ExpressServer;