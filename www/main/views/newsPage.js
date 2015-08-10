(function () {
  'use strict';

  angular.module('kmsscan.views.NewsPage', [
    'kmsscan.services.News'
  ])
    .config(StateConfig)
    .controller('NewsPageCtrl', NewsPageController);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.newsPage', {
        url:   '/newsPage/:id',
        views: {
          'menuContent': {
            templateUrl: 'main/views/newsPage.html',
            controller:  'NewsPageCtrl as newsPage'
          }
        }

      });
  }

  function NewsPageController($stateParams, newsService) {
    var vm = this; // view-model

    vm.item = newsService.get($stateParams.id);

  }

}());