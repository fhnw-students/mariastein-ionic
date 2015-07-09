(function () {
  'use strict';

  angular.module('kmsscan.views.News', [])
    .config(StateConfig)
    .controller('NewsCtrl', NewsController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('news', {
        url:         '/news',
        templateUrl: 'main/views/news.html',
        controller:  'NewsCtrl as welcome'
      });
  }


  function NewsController() {
    var wm = this;  // view-model

    // Code goes here

  }


}());
