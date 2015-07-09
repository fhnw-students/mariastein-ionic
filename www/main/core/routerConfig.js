(function () {
  'use strict';

  angular.module('kmsscan.routerConfig', [])
    .config(RouterConfig);

  function RouterConfig($urlRouterProvider) {

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/menu');

  }

}());