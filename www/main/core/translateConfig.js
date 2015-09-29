/**
 * @module kmsscan.translateConfig
 * @author Gerhard Hirschfeld
 *
 * @description
 * This configuration defines the handle of the third-party-lib $translate
 */
(function () {
  'use strict';

  angular.module('kmsscan.translateConfig', [])
    .constant('languagesConstant', new Languages())
    .config(TranslateConfig);

  /**
   * @name Languages
   * @description
   * This is a constant in angular-js. The index is important for getting
   * data from the typo3 backend
   */
  function Languages() {
    return [
      'DE', 'FR', 'EN', 'IT'
    ];
  }

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