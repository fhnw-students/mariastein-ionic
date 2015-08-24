var db;
(function () {
  'use strict';

  angular.module('kmsscan', [

    // Libaries
    'ionic',
    'ngCordova',
    'ngSanitize',
    'pascalprecht.translate',

    // Core components
    'kmsscan.ionicPlatform',
    'kmsscan.routerConfig',
    'kmsscan.translateConfig',

    'kmsscan.services',
    'kmsscan.directives',
    'kmsscan.run',

    // Views
    'kmsscan.views'

  ]);

}());
