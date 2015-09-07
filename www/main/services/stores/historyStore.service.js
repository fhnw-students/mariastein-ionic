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
  function HistoryStoreService($q, Logger, historySqlService) {
    var log = new Logger('kmsscan.services.stores.History');
    log.info('init');
    var storage;

    // Public API
    var service = {
      activate: activate,

      set: set,
      visited: visited,
      getAll: getAll,
      get: get
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function visited(id) {
      var deferred = $q.defer();
      historySqlService.select(id)
        .then(function (results) {
          log.info('visited -> select', results);
          if (results.length > 0) {
            return historySqlService.update(id);
          } else {
            return historySqlService.create(id);
          }
        })
        .then(function (res) {
          log.info('visited -> saved', res);
          deferred.resolve(res);
        })
        .catch(deferred.reject);
      return deferred.promise;
    }

    function set(data) {
      storage = data;
      log.info('set()', data);
    }

    function getAll() {
      return historySqlService.getAll();
    }

    function get(uid) {
      return storage.filter(function (item) {
          return item.uid === parseInt(uid, 10);
        })[0];
    }

    function activate() {
      return historySqlService.sync()
        .then(function (history) {
          storage = history;
        });
    }

  }
})();