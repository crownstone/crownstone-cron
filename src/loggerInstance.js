let Logger = require('le_node');
let config = require('./config/config.' + (process.env.NODE_ENV || 'local'));

const logger = new Logger({ token: config.logEntries, console: true, minLevel: 1 });

module.exports = logger;