(function () {
  'use strict';

  angular.module('kmsscan.views.NotFound', [])
    .config(StateConfig)
    .controller('NotFoundCtrl', NotFoundController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.notFound', {
        url:   '/not-found',
        views: {
          'menuContent': {
            templateUrl: 'main/views/notFound.html',
            controller:  'NotFoundCtrl as notFound'
          }
        }
      });
  }


  function NotFoundController() {
    var vm = this; // view-model


  }


}());
