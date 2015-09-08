(function () {
  'use strict';

  angular
    .module('kmsscan.services.Data', [])
    .factory('dataService', DataService);

  function DataService($http, $q, $log) {

    var data = [];
    var fulfilled = false;

    var service = {
      isFulfilled: isFulfilled,
      loadCsv:     loadCsv,
      has:         has,
      get:         get
    };

    return service;

    ////////////////

    function isFulfilled() {
      return fulfilled;
    }

    function loadCsv() {
      var deferred = $q.defer();
      $http.get('data/dataset.csv')
        .success(function (res) {
          fulfilled = true;
          var result = Papa.parse(res, {header: true});
          data = result.data.map(function(item) {
            item.Images = item.Images.split(',');
            return item;
          });
          $log.info('data: ', data);
          deferred.resolve(data);
        })
        .error(function (err) {
          console.error(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function get(id) {
      if (!id) {
        return data;
      } else {
        for (var i = 0; i < data.length; i++) {
          if (data[i].ID === id.toString()) {
            return data[i];
          }
        }
      }
    }

    function has(id) {
      var bol = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i].ID === id.toString()) {
          bol = true;
        }
      }
      return bol;
    }


  }
})();