(function () {
  'use strict';

  angular
    .module('kmsscan.services.News', [])
    .factory('newsService', NewsService);

  function NewsService($q) {

    var news = [];

    var service = {
      init: init,
      get:  get
    };

    return service;

    ////////////////

    function init() {
      var deferred = $q.defer();

      news.push(
        {
          id:    1,
          title: 'Spezialführung am 11.8.2015',
          text:  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam cupiditate ex neque quo vel. Aliquam asperiores aut commodi cumque excepturi facere illo in minus perferendis, saepe! Corporis fugit necessitatibus officiis!'
        }
      );

      deferred.resolve();
      return deferred.promise;
    }

    function get(id) {
      if (!id) {
        return news;
      } else {
        return _.find(news, function (item) {
          return item.id === parseInt(id, 10);
        });
      }

    }

  }
})();