module.exports = function () {

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
    'www/main/lib/ionic/js/ionic.bundle.js',
    'www/main/lib/lodash/lodash.min.js',
    'www/main/lib/angular-sanitize/angular-sanitize.js',
    'www/main/lib/angular-translate/angular-translate.min.js',
    'www/main/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',

    'www/main/**/*.module.js',
    'www/main/**/*.js'
  ]);

  conf.files = conf.files.concat(
    'www/main/**/*.html'
  );


  return conf;
};
