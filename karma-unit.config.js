module.exports = function (config) {

  // Configuration
  var conf = {
    frameworks: ['mocha', 'chai'],
    reporters:  ['mocha'],
    browsers:   ['Chrome'],
    autoWatch:  true,

    // these are default values anyway
    singleRun: false,
    colors:    true,

    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha-reporter',
      'karma-ng-html2js-preprocessor'
    ],
    files:   []
  };

  // Test Lib files
  conf.files = conf.files.concat([
    'node_modules/chai/chai.js',
    'node_modules/chai-as-promised/lib/chai-as-promised.js',
    'node_modules/chai-spies/chai-spies.js',
    'test/lib/chai-should.js',
    'test/lib/chai-expect.js',
    'test/lib/chai-spies.js',
    'test/data/**/*.data.js'
  ]);

  // angular script files & 3rd party code from bower
  conf.files = conf.files.concat([
    'www/lib/ionic/js/ionic.bundle.js',
    'www/lib/lodash/lodash.min.js',
    'www/lib/angular-sanitize/angular-sanitize.js',
    'www/lib/angular-translate/angular-translate.min.js',
    'www/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
    'www/lib/papaparse/papaparse.min.js',
    'www/lib/localforage/dist/localforage.min.js',
    'www/lib/angular-localForage/dist/angular-localForage.min.js',

    'www/main/app.js',
    'www/main/services/services.module.js',
    'www/main/directives/directives.module.js',
    'www/main/views/views.module.js',
    'www/main/core/ionicPlatform.js',
    'www/main/core/routerConfig.js',
    'www/main/core/translateConfig.js',
    'www/main/services/barcodeScanner.service.js',
    'www/main/services/data.service.js',
    'www/main/services/history.service.js',
    'www/main/directives/navMenuButton.js',
    'www/main/directives/scanButton.js',
    'www/main/app.run.js',
    'www/main/views/init.js',
    'www/main/views/tutorial.js',
    'www/main/views/detail.js',
    'www/main/views/notFound.js',
    'www/main/views/welcome.js',
    'www/main/views/contact.js',
    'www/main/views/history.js',
    'www/main/views/news.js',
    'www/main/views/menu.js',
    'www/main/views/scan.js'
  ]);

  // All Templates
  conf.files = conf.files.concat(
    'www/main/**/*.html'
  );

  // Unit Test files
  conf.files = conf.files.concat(
    'www/lib/angular-mocks/angular-mocks.js',
    'test/unit/**/*.spec.js'
  );

  config.set(conf);
};

