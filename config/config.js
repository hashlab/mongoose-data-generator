const config = {
  schemas: {
    input:
      '/home/celias/repositories/infinity-gauntlet/src/application/core/models/',
    output: '/home/celias/npm-modules/mongoose-data-generator/schemas'
  },
  dependencies: [
    {
      install: 'mongoose-auto-increment',
      setup: {
        commands: [
          "autoIncrement = require('mongoose-auto-increment')",
          'autoIncrement.initialize($connection);'
        ],
        loadBeforeConnect: false
      }
    },
    {
      install: 'mongoose-time'
    }
  ],
  database: {
    type: 'mongo',
    connectionUrl: 'mongodb://localhost:27016/',
    name: 'test',
    options: {
      useNewUrlParser: true
    }
  },
  debug: true
};

module.exports = config;
