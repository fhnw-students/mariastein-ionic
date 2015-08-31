(function () {
  'use strict';

  angular.module('kmsscan.views.Map', [])
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


  function MapController() {
    var vm = this;  // view-model



  }


}());
