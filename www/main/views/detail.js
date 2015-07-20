(function () {
  'use strict';

  angular.module('kmsscan.views.Detail', [
    'kmsscan.services.History'
  ])
    .config(StateConfig)
    .controller('DetailCtrl', DetailController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.detail', {
        url:   '/detail/:id',
        views: {
          'menuContent': {
            templateUrl: 'main/views/detail.html',
            controller:  'DetailCtrl as detail'
          }
        }

      });
  }


  function DetailController($stateParams, historyService) {
    var vm = this; // view-model
    vm.item = {};

    historyService.get($stateParams.id)
      .then(function (result) {
        vm.item = result;
      });

    console.log(vm.item);
    console.log($stateParams);

  }


}());
