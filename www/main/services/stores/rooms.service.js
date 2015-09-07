(function () {
  'use strict';

  angular
    .module('kmsscan.services.stores.Rooms', [
      'kmsscan.utils.Logger'
    ])
    .factory('roomsStoreService', RoomsStoreService);

  /**
   * Service Class
   * @param $q
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function RoomsStoreService(Logger) {
    var log = new Logger('kmsscan.services.stores.Rooms');
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
      storage = data;
      log.info('set()', data);
    }

    function getAll() {
      return storage;
    }

    function get(id) {
      return storage.filter(function (item) {
          return item.uid === id;
        })[0] || {};
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////


  }
})();