var db;
(function () {
  'use strict';

  angular.module('kmsscan', [

    // Libaries
    'ionic',
    'ngCordova',
    'ngSanitize',
    'pascalprecht.translate',
    'ngIOS9UIWebViewPatch',

    // Core components
    'kmsscan.ionicPlatform',
    'kmsscan.routerConfig',
    'kmsscan.translateConfig',

    'kmsscan.utils',
    'kmsscan.directives',
    'kmsscan.run',

    // Views
    'kmsscan.views'

  ]);

}());
