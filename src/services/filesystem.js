const Promise = require("bluebird");
const fs = require("fs-extra");
const logger = require("@services/logging").logger;

const readFile = Promise.promisify(fs.readFile);
const readDir = Promise.promisify(fs.readdir);
const writeFile = Promise.promisify(fs.writeFile);
const lstat = Promise.promisify(fs.lstat);
const copy = Promise.promisify(fs.copy);
const remove = Promise.promisify(fs.remove);
const mkdir = Promise.promisify(fs.mkdir);

module.exports.readDirAsync = function readDirAsync(
  dirname,
  includeSubdirs = false
) {
  logger(`Reading directory ${dirname}`);
  return Promise.resolve()
    .then(readDirectory)
    .then(filterSubDirectories)
    .then(finishHim);

  function readDirectory() {
    return readDir(dirname).then(filenames => {
      return filenames;
    });
  }

  function filterSubDirectories(filenames) {
    const validFiles = [];
    logger("Filtering sub-directories");

    if (includeSubdirs) {
      return filenames;
    } else {
      return Promise.resolve(filenames)
        .each(checkFile)
        .then(respond);

      function checkFile(filename) {
        return lstat(dirname + filename).then(stat => {
          if (stat.isFile()) {
            validFiles.push(filename);
          } else {
            logger(`Ignoring sub-directory ${dirname}${filename}`);
          }
        });
      }

      function respond() {
        return validFiles;
      }
    }
  }

  function finishHim(filenames) {
    logger(`Finish reading directory ${dirname}`);
    return filenames;
  }
};

module.exports.readFileAsync = function readFileAsync(dirname, filename) {
  const filePath = dirname + filename;
  return readFile(filePath, "utf8")
    .then(contents => {
      return contents;
    })
    .catch(SyntaxError, function(e) {
      logger("File had syntax error", e);
    })
    .catch(function(e) {
      logger("Error reading file", e);
    });
};

module.exports.writeFileAsync = function writeFileAsync(fileContent, filename) {
  logger(`Writing file ${filename}`);
  return writeFile(filename, fileContent).then(() => {
    logger(`Wrote file ${filename}`);
  });
};

module.exports.copyAsync = function copyAsync(source, destination) {
  logger(`Copying ${source} to ${destination}`);
  return copy(source, destination).then(() => {
    logger("Copied source");
  });
};

module.exports.removeAsync = function removeAsync(target) {
  logger(`Removing ${target}`);
  return remove(target).then(() => {
    logger("Removed target");
  });
};

module.exports.mkdirAsync = function mkdirAsync(target) {
  logger(`Creating directory ${target}`);
  return mkdir(target)
    .then(() => {
      logger("Created directory");
    })
    .catch(function(e) {
      logger("Directory already exists", e);
    });
};
