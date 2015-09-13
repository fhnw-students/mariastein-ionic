(function () {
  'use strict';

  angular
    .module('kmsscan.services.stores.Objects', [
      'kmsscan.utils.Logger'
    ])
    .factory('objectsStoreService', ObjectsStoreService);

  /**
   * Service Class
   * @param $q
   * @param $cordovaSQLite
   * @param $ionicPlatform
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function ObjectsStoreService(Logger) {
    var log = new Logger('kmsscan.services.stores.Objects');
    log.info('init');
    var storage;


    // Public API
    var service = {
      set: set,
      has: has,
      getAll: getAll,
      get: get,
      visited: visited
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function has(uid) {
      return get(uid) !== undefined;
    }

    function set(data) {
      log.info('set()', data);
      storage = data;
    }

    function getAll() {
      return storage;
    }

    function get(uid) {
      return storage.filter(function (item) {
        return item.uid === parseInt(uid, 10);
      })[0];
    }

    function visited(id) {
      // TODO
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////


  }
})();