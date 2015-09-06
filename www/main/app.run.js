(function () {
  'use strict';

  angular.module('kmsscan.run', [])
    .run(run);

  function run($rootScope, $translate) {
    $rootScope.$on('onLanguageChange', function (event, langKey) {
      $translate.use(langKey);
    });
  }

}());