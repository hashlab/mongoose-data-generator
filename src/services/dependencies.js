const logger = require('@services/logging').logger;
const npm = require('npm-programmatic');
const config = require('@config/config').dependencies;


module.exports.install = function() {
  const deps = config.map(dep => dep.install);
  logger(`Installing dependencies: ${deps.join(', ')}`)

  return npm.install(deps, {
    cwd: '/home/celias/npm-modules/mongoose-data-generator',
    save: false,
    output: config.debug
  });
};

module.exports.setup = function(afterConnection, connection) {
  logger('Setting up dependencies after DB connection...')
  if (afterConnection) {
    if (connection) {
      let deps = [];
      
      config.filter(dep => dep.setup && !dep.setup.loadBeforeConnect).forEach(dep => deps = deps.concat(dep.setup.commands));
      
      console.log(deps)

    } else {
      logger('Connection is missing. Exiting.', true);
    }
  }
}
