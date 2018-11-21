require('module-alias/register');
const Promise = require('bluebird');
const config = require('@config/config');
const BabelService = require('@services/babel');
const DependenciesService = require('@services/dependencies');
const DBService = require('@services/database');
const logger = require('@services/logging').logger;
const FileSystemService = require('@services/filesystem');

const tempSchemasDir =
  '/home/celias/npm-modules/mongoose-data-generator/schemas/originals/';
const schemasDir = config.schemas.input;

Promise.resolve()
  // .then(parseSchemas)
  // .then(installDependencies)
  // .then(loadDependenciesBeforeConnect)
  .then(connectToDB)
  .then(loadDependenciesAfterConnect)
  // .then(importSchemas);

  function parseSchemas() {
    return Promise.resolve()
      .then(createTempDir)
      .then(copyDir)
      .then(transformSchemas)
      .then(removeTempDir);

    function createTempDir() {
      return FileSystemService.mkdirAsync(tempSchemasDir);
    }

    function copyDir() {
      return FileSystemService.copyAsync(schemasDir, tempSchemasDir);
    }

    function transformSchemas() {
      return BabelService.transformDirectoryAsync(
        tempSchemasDir,
        config.schemas.output
      );
    }

    function removeTempDir() {
      logger('Finished parsing schemas');
      return FileSystemService.removeAsync(tempSchemasDir);
    }
  }

  function installDependencies() {
    return DependenciesService.install();
  }

  function loadDependenciesBeforeConnect() {
    config.dependencies.forEach(dependency => {
      if (dependency.loadBeforeConnect) {
        DependenciesService.init(dependency)
      }
    })
  }

  function connectToDB () {
    const connection = DBService.connect();
    logger('Successfully connected to database!');

    return connection;
  }

  function loadDependenciesAfterConnect(connection) {
    DependenciesService.setup(true, connection);
  }

  function importSchemas() {
    const schemas = require('require-all')({
      dirname: config.schemasOutputDir,
      // filter: /(.+Controller)\.js$/,
      // excludeDirs: /^\.(git|svn)$/,
      recursive: true
    });

    logger(schemas);
  }
