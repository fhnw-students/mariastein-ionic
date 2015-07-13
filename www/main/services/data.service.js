(function () {
  'use strict';

  angular
    .module('kmsscan.services.Data', [])
    .factory('dataService', DataService);

  function DataService($http) {

    var data = [];
    var isFulfilled = false;

    var service = {
      isFullfilled: isFulfilled,
      loadCsv:      loadCsv,
      get:          get
    };

    return service;

    ////////////////

    function isFullfilled() {
      return isFulfilled;
    }

    function loadCsv() {
      $http.get('data/dataset.csv')
        .success(function (res) {
          isFulfilled = true;
          data = Papa.parse(res, {header: true});
        })
        .error(function (err) {
          console.error(err);
        });
    }

    function get(id) {
      if (!id) {
        return data;
      }else{
        angular.forEach(data, function (item) {
          if(item.ID === id.toString){
            return item;
          }
        });
      }
    }


  }
})();