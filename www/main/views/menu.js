(function () {
  'use strict';

  angular.module('kmsscan.views.Menu', [])
    .config(StateConfig)
    .controller('MenuCtrl', MenuController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu', {
        url:         '/menu',
        templateUrl: 'main/views/menu.html',
        controller:  'MenuCtrl as menu'
      });
  }

  function MenuController() {
    var vm = this;

  }


}());
