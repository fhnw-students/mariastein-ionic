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


  function HistoryController(historyService) {
    var vm = this; // view-model

    vm.list = [];
    historyService.init()
      .then(function (result) {
        vm.list = _.map(_.sortByOrder(result, ['date'], ['desc']), _.values);
      });


  }


}());
