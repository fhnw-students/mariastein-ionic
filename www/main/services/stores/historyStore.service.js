(function () {
  'use strict';

  angular
    .module('kmsscan.services.stores.History', [
      'kmsscan.utils.Logger',
      'kmsscan.services.sql.History'
    ])
    .factory('historyStoreService', HistoryStoreService);

  /**
   * Service Class
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function HistoryStoreService(Logger, historySqlService) {
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

    _activate();
    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function visited(id) {
      historySqlService.select(id)
        .then(function (result) {
          log.info('visited -> select', result);

        })
        .catch(function (err) {

        });


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
    function _activate() {
      historySqlService.sync()
        .then(function (history) {
          storage = history;
        });
    }

  }
})();