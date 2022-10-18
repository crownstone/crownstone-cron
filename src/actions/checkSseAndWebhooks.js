const Util = require("../util/util")
const sseLib = require("crownstone-sse")
const cloudLib = require("crownstone-cloud")

let config = require('../config/config.' + (process.env.NODE_ENV || 'local'));

class Checker {

  sse = false;
  hook = false;

  handleSseEvent(event) {
    if (this._check(event)) {
      this.sse = true;
    }
  }

  async pollHookEvent() {
    let results = await Util.get(config.hostname+'results');
    if (this._check(results?.res[0]?.data)) {
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

async function checkSseAndWebhooks() {
  // initialize the library
  const sse     = new sseLib.CrownstoneSSE(config.customSseEndpoint);
  const cloud   = new cloudLib.CrownstoneCloud(config.customCloudEndpoint);
  const hooks   = new cloudLib.CrownstoneWebhooks(config.customHookEndpoint);
  const checker = new Checker()

  let error = null;

  try {
    // ! wake server
    try {
      await Util.post(config.hostname+'wake')
    }
    catch (err) {
      console.log(new Date().valueOf() + " SseAndWebhooks: Wakeup timeout handled...");
    }
    // reset memory
    await Util.post(config.hostname+'reset')

    // we will login to the Crownstone cloud to obtain an accessToken.
    // It will be set automatically after successful login.
    console.log(new Date().valueOf() + " SseAndWebhooks: Logging in...");
    let data = await cloud.login(config.crownstoneUsername , config.crownstonePassword );
    sse.setAccessToken(data.accessToken);
    console.log(new Date().valueOf() + " SseAndWebhooks: Logged in.");

    console.log(new Date().valueOf() + " SseAndWebhooks: Create listener...");
    hooks.setApiKey(config.hooksApiKey);
    await hooks.removeListenerByUserId(data.userId);
    await hooks.createListener(data.userId, data.accessToken, ["command"], config.hostname+'hook');
    console.log(new Date().valueOf() + " SseAndWebhooks: Listener Created.");

    // now that we have an accessToken, we can start the eventstream.
    console.log(new Date().valueOf() + " SseAndWebhooks: Connecting...");
    await sse.start((event) => { checker.handleSseEvent(event); });
    console.log("Let's get started!");

    await cloud.crownstone(config.virtualCrownstoneId).turnOn()

    let now = Date.now();
    console.log(new Date().valueOf() + " SseAndWebhooks: Waiting on SSE...");
    while (Date.now() - now < config.waitTime && checker.sse === false) {
      await Util.wait(100);
    }
    if (checker.sse === false) { throw "NO_SSE_RECEIVED"; }

    console.log(new Date().valueOf() + " SseAndWebhooks: SSE received.");
    console.log(new Date().valueOf() + " SseAndWebhooks: Waiting on Hook...");
    await checker.pollHookEvent();

    while (Date.now() - now < config.waitTime && checker.hook === false) {
      await Util.wait(500);
      await checker.pollHookEvent();
    }

    if (checker.hook === false) { throw "NO_HOOK_RECEIVED"; }

    console.log(new Date().valueOf() + " SseAndWebhooks: HOOK received.");
  }
  catch(err) {
    console.log("Something went wrong... :(", err);
    error = err;
  }

  console.log(new Date().valueOf() + " SseAndWebhooks: shutting down server and SSE...");
  await sse.stop();
  console.log(new Date().valueOf() + " SseAndWebhooks: server shut and SSE down.");

  if (error !== null) {
    throw error;
  }
}


module.exports = checkSseAndWebhooks;

