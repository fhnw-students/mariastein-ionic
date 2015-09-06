(function () {
  'use strict';

  angular.module('kmsscan.views.Map', [
    'kmsscan.services.Map'
  ])
    .config(StateConfig)
    .controller('MapCtrl', MapController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.map', {
        url:   '/map',
        views: {
          'menuContent': {
            templateUrl: 'main/views/map.html',
            controller:  'MapCtrl as map'
          }
        }
      });
  }


  function MapController(mapService) {
    var vm = this;  // view-model
    vm.list = mapService.get();

  }


}());
