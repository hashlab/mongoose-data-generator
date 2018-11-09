const Promise = require("bluebird");
const FileSystemService = require("@services/filesystem");
const logger = require("@services/logging").logger;
const config = require("@config/config");
const babel = require("@babel/core");

const tempSchemasDir = "/home/celias/npm-modules/mongoose-data-generator/schemas/originals/";

module.exports.transformDirectoryAsync = function(dirname) {
  return Promise.resolve()
    .then(createTempDir)
    .then(copyDir)
    .then(readDir)
    .each(transformFile)
    .then(finishHim);

  function createTempDir() {
    return FileSystemService.mkdirAsync(tempSchemasDir);
  }

  function copyDir() {
    return FileSystemService.copyAsync(dirname, tempSchemasDir);
  }

  function readDir() {
    logger("Started reading input directory");
    return FileSystemService.readDirAsync(tempSchemasDir);
  }

  function transformFile(filename) {
    return Promise.resolve()
      .then(transformFile)
      .then(writeFile);

    function transformFile() {
      logger(`Parsing ${filename}`);
      return babel.transformFileSync(tempSchemasDir + filename).code;
    }

    function writeFile(parsedFile) {
      logger(`Parsed file ${dirname}${filename}`);
      return FileSystemService.writeFileAsync(
        parsedFile,
        `${config.schemasOutputDir}/${filename}`
      );
    }
  }

  function finishHim() {
    logger("Finished parsing schemas");
    return FileSystemService.removeAsync(tempSchemasDir);
  }
};
