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
      get:  get
    };

    return service;

    ////////////////

    function init() {
      var deferred = $q.defer();
      $localForage.getItem(HISTORY_STORAGE_KEY)
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
      id = id.toString();
      var deferred = $q.defer();
      var idx = _.findIndex(history, function(item){
        return item.data.ID = id;
      });
      if (idx >= 0) {
        history[idx].stamp = new Date().getTime();
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

      //for (var i = 0; i < history.length; i++) {
      //  if (history[i].id === id.toString()) {
      //    history[i].date = new Date().getTime();
      //    return;
      //  }
      //}
      //history.push({
      //  id:   id,
      //  date: new Date().getTime()
      //});
      //$localForage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    }

    function get(id) {
      if (!id) {
        return history;
      } else {
        return _.find(history, function(item){
          return item.data.ID = id;
        });
      }
    }

  }
})();