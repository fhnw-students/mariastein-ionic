(function () {
  'use strict';

  angular.module('kmsscan.views.News', [
    'kmsscan.services.News'
  ])
    .config(StateConfig)
    .controller('NewsCtrl', NewsController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.news', {
        url:   '/news',
        views: {
          'menuContent': {
            templateUrl: 'main/views/news.html',
            controller:  'NewsCtrl as news'
          }
        }
      });
  }


  function NewsController(newsService) {
    var vm = this;  // view-model

    vm.list = newsService.get();
    
  }


}());
