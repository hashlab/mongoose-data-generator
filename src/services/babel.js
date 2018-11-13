const Promise = require("bluebird");
const logger = require("@services/logging").logger;
const babel = require("@babel/core");
const FileSystemService = require('@services/filesystem');

module.exports.transformDirectoryAsync = function(inDir, outDir) {
  return Promise.resolve()
    .then(readDir)
    .each(transformFile)

  function readDir() {
    logger("Started reading input directory");
    return FileSystemService.readDirAsync(inDir);
  }

  function transformFile(filename) {
    return Promise.resolve()
      .then(transformFile)
      .then(writeFile);

    function transformFile() {
      logger(`Parsing ${filename}`);
      return babel.transformFileSync(inDir + filename).code;
    }

    function writeFile(parsedFile) {
      logger(`Parsed file ${filename}`);
      return FileSystemService.writeFileAsync(
        parsedFile,
        `${outDir}/${filename}`
      );
    }
  }
};
