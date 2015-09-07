(function () {
  'use strict';

  angular.module('kmsscan.views.MapPage', [
    'kmsscan.services.Map'
  ])
    .config(StateConfig)
    .controller('MapPageCtrl', MapPageController);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.mapPage', {
        url:   '/mapPage/:id',
        views: {
          'menuContent': {
            templateUrl: 'main/views/mapPage.html',
            controller:  'MapPageCtrl as mapPage'
          }
        }

      });
  }

  function MapPageController($stateParams, mapService) {
    var vm = this; // view-model

    vm.item = mapService.get($stateParams.id);

  }

}());