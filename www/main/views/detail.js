(function () {
  'use strict';

  angular.module('kmsscan.views.Detail', [])
    .config(StateConfig)
    .controller('DetailCtrl', DetailController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('detail', {
        url:         '/detail/:id',
        templateUrl: 'main/views/detail.html',
        controller:  'DetailCtrl as detail'
      });
  }


  function DetailController($stateParams, dataService) {
    var vm = this; // view-model

    vm.item = dataService.get($stateParams.id);

    console.log(vm.item);
    console.log($stateParams);

  }


}());
