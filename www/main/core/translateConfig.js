(function () {
  'use strict';

  angular.module('kmsscan.translateConfig', [])
    .config(TranslateConfig);

  /**
   * @name TranslateConfig
   * @description
   * This configuration sets $translate settings like default language
   */
  function TranslateConfig($translateProvider) {
    $translateProvider.preferredLanguage('EN');
    $translateProvider.useSanitizeValueStrategy(null);
    $translateProvider.useStaticFilesLoader({
      prefix: './i18n/',
      suffix: '.json'
    });
  }

}());