(function () {
  'use strict';

  angular.module('kmsscan.views.History', [])
    .config(StateConfig)
    .controller('HistoryCtrl', HistoryController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('history', {
        url:         '/history',
        templateUrl: 'main/views/history.html',
        controller:  'HistoryCtrl as history'
      });
  }


  function HistoryController() {
    var vm = this; // view-model

    // Code goes here

  }


}());
