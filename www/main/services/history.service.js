(function () {
  'use strict';

  angular
    .module('kmsscan.services.History', [
      'LocalForageModule'
    ])
    .constant('LOCAL_STORAGE_KEY', 'kmsscan-history')
    .factory('historyService', HistoryService);

  function HistoryService($q, $log, LOCAL_STORAGE_KEY, $localForage) {

    var history = [];

    var service = {
      init: init,
      add:  add,
      get:  get
    };

    return service;

    ////////////////

    function init() {
      var deferred = $q.defer();
      $localForage.getItem(LOCAL_STORAGE_KEY)
        .then(function (result) {
          if (result !== null) {
            history = JSON.parse(result);
          }
          deferred.resolve(history);
        })
        .catch(function (err) {
          $log.error(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function add(id) {
      for (var i = 0; i < history.length; i++) {
        if (history[i].id === id.toString()) {
          history[i].date = new Date().getTime();
          return;
        }
      }
      history.push({
        id:   id,
        date: new Date().getTime()
      });
      $localForage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    }

    function get(id) {
      if (!id) {
        return history;
      } else {
        for (var i = 0; i < history.length; i++) {
          if (history[i].id === id.toString()) {
            return history[i];
          }
        }
      }
    }

  }
})();