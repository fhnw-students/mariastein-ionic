(function () {
  'use strict';

  angular.module('kmsscan.views.History', [
    'kmsscan.services.History'
  ])
    .config(StateConfig)
    .controller('HistoryCtrl', HistoryController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.history', {
        url:   '/history',
        views: {
          'menuContent': {
            templateUrl: 'main/views/history.html',
            controller:  'HistoryCtrl as history'
          }
        }
      });
  }


  function HistoryController(historyService, $timeout) {
    var vm = this; // view-model


    vm.hist = historyService.get();
    vm.list = _.map(_.sortByOrder(vm.hist, ['date'], ['desc']), _.values);

    // Code goes here

  }


}());
