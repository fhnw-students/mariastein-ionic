var sharedConfig = require('./karma-shared.config.js');

module.exports = function (config) {
  var conf = sharedConfig();

  conf.files = conf.files.concat(

    'www/lib/angular-mocks/angular-mocks.js',

    'test/unit/**/*.spec.js'
  );

  config.set(conf);
};

