(function () {
  'use strict';

  angular.module('kmsscan.translateConfig', [])
    .config(TranslateConfig);

  function TranslateConfig($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.preferredLanguage('en');
    $translateProvider.useStaticFilesLoader({
      prefix: './i18n/',
      suffix: '.json'
    });
  }

}());