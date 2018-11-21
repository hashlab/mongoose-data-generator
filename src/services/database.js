const logger = require('@services/logging').logger;
var mongoose = require('mongoose');
const Promise = require('bluebird');
const config = require('@config/config').database;

// Properties
let dbHandler;

init()

function init() {
  logger('Initiating database service');
  const db = config.type.toLowerCase();

  switch (db) {
    case 'mongo':
      logger('Database type found: Mongo');
      dbHandler = mongoose;
      dbHandler.Promise = Promise;
      break;
  
    default:
      logger(`Unkown database type ${config.database.type}. Exiting.`, true);      
      return -1;
  }
}

module.exports.connect = function() {
  logger('Connecting to database...');

  return dbHandler.connect(config.connectionUrl + config.name, config.options);
}
