const config = require("@config/config");

module.exports.logger = (message, override) => {
    if (config.debug || override) {
        console.log(message)
    }
}