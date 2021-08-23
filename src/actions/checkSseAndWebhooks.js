const Util = require("../util/util")
const logger = require("../loggerInstance")
const sseLib = require("crownstone-sse")
const cloudLib = require("crownstone-cloud")

const express = require('express')
const bodyParser = require('body-parser')

let config = require('../config/config.' + (process.env.NODE_ENV || 'local'));

class ExpressServer {

  app
  server
  checker

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

      this.app.post('/', (req, res) => {
        this.checker.handleHookEvent(req.body)
        res.send('Done');
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


class Checker {

  sse = false;
  hook = false;

  handleSseEvent(event) {
    if (this._check(event)) {
      this.sse = true;
    }
  }

  handleHookEvent(event) {
    if (this._check(event.data)) {
      this.hook = true;
    }
  }

  _check(eventData) {
    if (eventData?.type === 'command' && eventData?.switchData[0].id === config.virtualCrownstoneId) {
      return true;
    }
    return false;
  }
}

async function checkSseAndWebhooks(mongo) {
  // initialize the library
  const sse     = new sseLib.CrownstoneSSE();
  const cloud   = new cloudLib.CrownstoneCloud();
  const hooks   = new cloudLib.CrownstoneWebhooks(config.customHookEndpoint);
  const checker = new Checker()
  const server  = new ExpressServer(checker)

  let error = null;

  try {
    logger.info(new Date().valueOf() + " SseAndWebhooks: Starting server...");
    await server.run()
    logger.info(new Date().valueOf() + " SseAndWebhooks: Server started.");

    // we will login to the Crownstone cloud to obtain an accessToken.
    // It will be set automatically after successful login.
    logger.info(new Date().valueOf() + " SseAndWebhooks: Logging in...");
    let data = await cloud.login(config.crownstoneUsername , config.crownstonePassword );
    sse.setAccessToken(data.accessToken);
    logger.info(new Date().valueOf() + " SseAndWebhooks: Logged in.");

    logger.info(new Date().valueOf() + " SseAndWebhooks: Create listener...");
    hooks.setApiKey(config.hooksApiKey);
    await hooks.removeListenerByUserId(data.userId);
    await hooks.createListener(data.userId, data.accessToken, ["command"], config.hostname);
    logger.info(new Date().valueOf() + " SseAndWebhooks: Listener Created.");

    // now that we have an accessToken, we can start the eventstream.
    logger.info(new Date().valueOf() + " SseAndWebhooks: Connecting...");
    await sse.start((event) => { checker.handleSseEvent(event); });
    console.log("Let's get started!");

    await cloud.crownstone(config.virtualCrownstoneId).turnOn()

    let now = Date.now();
    logger.info(new Date().valueOf() + " SseAndWebhooks: Waiting on SSE...");
    while (Date.now() - now < config.waitTime && checker.sse === false) {
      await Util.wait(100);
    }
    if (checker.sse === false) { throw "NO_SSE_RECEIVED"; }

    logger.info(new Date().valueOf() + " SseAndWebhooks: SSE received.");
    logger.info(new Date().valueOf() + " SseAndWebhooks: Waiting on Hook...");
    while (Date.now() - now < config.waitTime && checker.hook === false) {
      await Util.wait(100);
    }

    if (checker.hook === false) { throw "NO_HOOK_RECEIVED"; }

    logger.info(new Date().valueOf() + " SseAndWebhooks: HOOK received.");
  }
  catch(err) {
    console.log("Something went wrong... :(", err);
    error = err;
  }

  logger.info(new Date().valueOf() + " SseAndWebhooks: shutting down server and SSE...");
  await sse.stop();
  await server.shutdown()
  logger.info(new Date().valueOf() + " SseAndWebhooks: server shut and SSE down.");

  if (error !== null) {
    throw error;
  }
}


module.exports = checkSseAndWebhooks;

