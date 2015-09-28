(function () {
  'use strict';

  var namespace = 'kmsscan.views.NewsPage';

  angular.module(namespace, [
    'kmsscan.utils.Logger'
  ])
    .config(StateConfig)
    .controller('NewsPageCtrl', NewsPageController);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.newsPage', {
        url: '/newsPage/:id',
        views: {
          'menuContent': {
            templateUrl: 'main/views/newsPage.html',
            controller: 'NewsPageCtrl as newsPage'
          }
        }

      });
  }

  function NewsPageController($stateParams, Logger) {
    var vm = this; // view-model
    var log = new Logger(namespace);


  }

}());


/**


 pagesStoreService.get(uid, langKey)
 .then(function (result) {
                log.warn('getNews', result);
              })
 .catch(function (err) {
                log.error('getNews', err);
              });

 **/