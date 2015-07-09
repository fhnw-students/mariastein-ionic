(function () {
  'use strict';

  angular.module('kmsscan', [

    // Libaries
    'ionic',
    'ngSanitize',
    'pascalprecht.translate',

    // Core components
    'kmsscan.ionicPlatform',
    'kmsscan.routerConfig',
    'kmsscan.translateConfig',

    // Views
    'kmsscan.views'

  ]);

}());
