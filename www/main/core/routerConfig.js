/**
 * @name RouterConfig
 * @module kmsscan.routerConfig
 * @author Gerhard Hirschfeld
 *
 * @description
 * This configuration sets rounting settings
 */
(function () {
  'use strict';

  angular.module('kmsscan.routerConfig', [])
    .config(RouterConfig);

  function RouterConfig($urlRouterProvider, $ionicConfigProvider) {

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/init');
    $ionicConfigProvider.views.maxCache(0);

  }

}());