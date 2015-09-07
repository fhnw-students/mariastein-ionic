(function () {
  'use strict';

  angular
    .module('kmsscan.services.stores.History', [
      'kmsscan.utils.Logger'
    ])
    .factory('historyStoreService', HistoryStoreService);

  /**
   * Service Class
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function HistoryStoreService(Logger) {
    var log = new Logger('kmsscan.services.stores.History');
    log.info('init');
    var storage;


    // Public API
    var service = {
      set: set,
      visited: visited,
      getAll: getAll,
      get: get
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function visited(id) {
      // TODO
    }

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