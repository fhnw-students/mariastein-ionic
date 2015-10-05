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
      'karma-ng-html2js-preprocessor',
      'karma-coverage'
    ],
    files:   [],
      preprocessors: {
          // source files, that you wanna generate coverage for
          // do not include tests or libraries
          // (these files will be instrumented by Istanbul)
          'src/*.js': ['coverage']
      }
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
      'lib/ionic/js/ionic.bundle.js',
        'lib/lodash/lodash.min.js',
        'lib/angular-sanitize/angular-sanitize.js',
        'lib/angular-translate/angular-translate.min.js',
        'lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
        'lib/moment/min/moment.min.js',
        'lib/pouchdb/dist/pouchdb.min.js',
        'lib/pouchdb-find/dist/pouchdb.find.min.js',
        'lib/angular-pouchdb/angular-pouchdb.min.js',
        'lib/angular-ios9-uiwebview-patch/angular-ios9-uiwebview-patch.js',

        'lib/ngCordova/dist/ng-cordova.min.js',
        'cordova.js',

            <!-- your app's js -->
        'main/app.js',

        'main/services/services.module.js',
        'main/services/rest/rest.module.js',
        'main/services/stores/stores.module.js',

        'main/directives/directives.module.js',
        'main/views/views.module.js',

        'main/utils/utils.module.js',
        'main/utils/logger.js',
        'main/utils/helpers.js',
        'main/utils/parsers.js',
        'main/utils/erros.js',
        'main/utils/pouchDb.js',

        'main/core/ionicPlatform.js',
        'main/core/routerConfig.js',
        'main/core/translateConfig.js',

        'main/services/rest/typo3.service.js',
        'main/services/stores/settingsStore.service.js',
        'main/services/stores/pagesStore.service.js',
        'main/services/stores/roomsStore.service.js',
        'main/services/sync.service.js',
        'main/services/images.service.js',

        'main/directives/navMenuButton.js',
        'main/directives/scanButton.js',
        'main/directives/spinner.js',
        'main/directives/infoCard.js',
        'main/directives/updateContentButton.js',
        'main/directives/image.js',

        'main/app.run.js',

        'main/views/tutorial.js',
        'main/views/detail.js',
        'main/views/notFound.js',
        'main/views/welcome.js',
        'main/views/contact.js',
        'main/views/history.js',
        'main/views/news.js',
        'main/views/map.js',
        'main/views/mapPage.js',
        'main/views/menu.js',
        'main/views/scan.js',
        'main/views/settings.js'
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

