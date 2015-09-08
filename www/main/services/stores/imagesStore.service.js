(function () {
  'use strict';

  angular
    .module('kmsscan.services.stores.Images', [
      'kmsscan.utils.Logger'
    ])
    .factory('imagesStoreService', ImagesStoreService);

  /**
   * Service Class
   * @param $q
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function ImagesStoreService(Logger) {
    var log = new Logger('kmsscan.services.stores.Images');
    log.info('init');
    var storage;


    // Public API
    var service = {
      set: set,
      getAll: getAll,
      get: get
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
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

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////


  }
})();