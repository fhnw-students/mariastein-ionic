var sharedConfig = require('./karma-shared.config.js');

module.exports = function (config) {
  var conf = sharedConfig();

  conf.files = conf.files.concat(
    'test/unit/**/*.spec.js'
  );

  config.set(conf);
};

