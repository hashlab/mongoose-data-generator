require("module-alias/register");
const Promise = require("bluebird");
const config = require("@config/config");
const BabelService = require("@services/babel");
const logger = require("@services/logging").logger;

Promise.resolve(config.schemasInputDir)
  .then(BabelService.transformDirectoryAsync)
  .then(importSchemas);

function importSchemas() {
  const schemas = require("require-all")({
    dirname: config.schemasOutputDir,
    // filter: /(.+Controller)\.js$/,
    // excludeDirs: /^\.(git|svn)$/,
    recursive: true
  });

  logger(schemas)
}
