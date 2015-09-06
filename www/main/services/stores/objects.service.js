(function () {
  'use strict';

  angular
    .module('kmsscan.services.stores.Objects', [])
    .factory('objectsStoreService', ObjectsStoreService);

  /**
   * Service Class
   * @param $q
   * @param $cordovaSQLite
   * @param $ionicPlatform
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function ObjectsStoreService() {
    console.info('[ObjectsStoreService]');
    var storage;


    // Public API
    var service = {
      init: init,
      getAll: getAll,
      get: get,
      visited: visited
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function init(data) {
      storage = data;
    }

    function getAll() {
      return storage;
    }

    function get(id) {
      return storage.filter(function (item) {
          return item.uid === id;
        })[0] || {};
    }

    function visited(id) {
      // TODO
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////


  }
})();