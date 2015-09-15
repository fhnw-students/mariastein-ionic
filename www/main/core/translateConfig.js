(function () {
  'use strict';

  angular.module('kmsscan.translateConfig', [])
    .config(TranslateConfig);

  function TranslateConfig($translateProvider) {
    $translateProvider.preferredLanguage('EN');
    $translateProvider.useSanitizeValueStrategy(null);
    $translateProvider.useStaticFilesLoader({
      prefix: './i18n/',
      suffix: '.json'
    });
  }

}());