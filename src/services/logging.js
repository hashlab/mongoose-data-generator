const config = require("@config/config");

module.exports.logger = message => {
    if (config.debug) {
        console.log(message)
    }
}