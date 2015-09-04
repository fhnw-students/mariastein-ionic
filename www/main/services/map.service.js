(function () {
  'use strict';

  angular
    .module('kmsscan.services.Map', [])
    .factory('mapService', MapService);

  function MapService($q) {

    var items = [];

    var service = {
      init: init,
      get:  get
    };

    return service;

    ////////////////

    function init() {
      var deferred = $q.defer();

      items.push(
          {
            id: 1,
            img: 'kapelle.jpg',
            title: 'Johanneskapelle',
            scanned: '2/5'
          },
          {
            id: 2,
            img: 'kapelle2.jpg',
            title: 'Markuskapelle',
            scanned: '3/5'
          }
      );
      deferred.resolve();
      return deferred.promise;
    }
    function get(id) {
      if (!id) {
        return items;
      } else {
        return _.find(items, function (item) {
          return item.id === parseInt(id, 10);
        });
      }

    }

  }
})();