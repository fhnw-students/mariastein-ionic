(function () {
  'use strict';

  var namespace = 'kmsscan.views.News';

  angular.module(namespace, [
    'kmsscan.utils.Logger'
  ])
    .config(StateConfig)
    .controller('NewsCtrl', NewsController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.news', {
        url: '/news',
        views: {
          'menuContent': {
            templateUrl: 'main/views/news.html',
            controller: 'NewsCtrl as news'
          }
        }
      });
  }


  function NewsController(Logger) {
    var vm = this;  // view-model
    var log = new Logger(namespace);



  }


}());

/**



 pagesStoreService.getNews('DE')
 .then(function (result) {
                log.warn('getNews', result);
              })
 .catch(function (err) {
                log.error('getNews', err);
              });



 pagesStoreService.visitedByUid(uid)
 .then(function (result) {
                log.warn('getNews', result);
              })
 .catch(function (err) {
                log.error('getNews', err);
              });

 **/