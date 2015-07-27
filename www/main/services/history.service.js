(function () {
  'use strict';

  angular
    .module('kmsscan.services.History', [
      'LocalForageModule',
      'kmsscan.services.Data'
    ])
    .constant('HISTORY_STORAGE_KEY', 'kmsscan-history')
    .factory('historyService', HistoryService);

  function HistoryService($q, $log, HISTORY_STORAGE_KEY, $localForage, dataService) {

    var history = [];

    var service = {
      init: init,
      add:  add,
      get:  get,
      set:  set
    };

    return service;

    ////////////////

    function set(data) {
      history = data;
    }

    function init() {
      var deferred = $q.defer();
      $localForage.getItem(HISTORY_STORAGE_KEY)
        .then(function (result) {
          if (result !== null) {
            history = JSON.parse(result);
            $log.info('history: ', history.length, JSON.stringify(history));
          }
          deferred.resolve();
        })
        .catch(function (err) {
          $log.error(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function add(id) {
      id = id.toString();
      var deferred = $q.defer();
      var idx = _.findIndex(history, function (item) {
        return item.data.ID === id;
      });
      if (idx >= 0) {
        history[idx].stamp = new Date().getTime();
        history[idx].data = dataService.get(history[idx].data.ID);
        $localForage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
        deferred.resolve(history[idx]);
      } else {
        if (dataService.has(id)) {
          var newItem = {
            data:  dataService.get(id),
            stamp: new Date().getTime()
          };
          history.push(newItem);
          $localForage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
          deferred.resolve(newItem);
        } else {
          deferred.reject("NotFound");

        }
      }
      return deferred.promise;
    }

    function get(id) {
      var deferred = $q.defer();
      if (!id) {
        deferred.resolve(history);
      } else {
        deferred.resolve(_.find(history, function (item) {
          return item.data.ID === id;
        }));
      }
      return deferred.promise;
    }

  }
})();