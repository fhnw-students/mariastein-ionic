(function () {
  'use strict';

  angular
    .module('kmsscan.services.sql.History', [
      'kmsscan.utils.Logger',
      'kmsscan.utils.SqlLite',

      'kmsscan.services.stores.History'
    ])
    .factory('historySqlService', HistorySqlService);

  /**
   * Static Variables
   * @type {{IMAGES: string}}
   */
  HistorySqlService.TABLENAME = 'history';

  /**
   * Service Class
   * @returns {{}}
   * @constructor
   */
  function HistorySqlService($q, $cordovaSQLite, $ionicPlatform, Logger, historyStoreService, sqlLiteUtilsService) {
    var log = new Logger('kmsscan.services.sql.History');
    log.info('init');

    var db;
    $ionicPlatform.ready(function () {
      if (window.cordova) {
        db = $cordovaSQLite.openDB({name: 'kmsscan'});
      }
    });

    var service = {
      sync: sync,
      getAll: getAll,
      create: create,
      update: update
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     *
     * @returns {deferred.promise|{then, always}}
     */
    function getAll() {
      return _selectAll();
    }

    /**
     *
     * @returns {deferred.promise|{then, always}}
     */
    function sync() {
      var deferred = $q.defer();

      _create()
        .then(function () {
          return getAll();
        })
        .then(function (res) {
          historyStoreService.set(res);
          deferred.resolve();
        })
        .catch(function (err) {
          log.error('sync()', err);
          deferred.reject();
        });
      return deferred.promise;
    }

    /**
     *
     * @param uid
     * @returns {deferred.promise|{then, always}}
     */
    function create(uid) {
      var query = 'INSERT INTO ' + HistorySqlService.TABLENAME + ' (uid, date) VALUES (?,?)';
      return $cordovaSQLite.execute(db, query, [
        uid,
        new Date().toString()
      ]);
    }

    /**
     *
     * @param uid
     * @returns {deferred.promise|{then, always}}
     */
    function update(uid) {
      var query = 'UPDATE ' + HistorySqlService.TABLENAME +
        ' SET date = \'' + new Date().toString() + '\' WHERE uid = ' + uid;
      return $cordovaSQLite.execute(db, query);
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////

    /**
     *
     * @returns {deferred.promise|{then, always}}
     * @private
     */
    function _selectAll() {
      return sqlLiteUtilsService.selectAll(db, HistorySqlService.TABLENAME);
    }

    /**
     *
     * @param data
     * @returns {Promise}
     * @private
     */
    function _insert(data) {
      var query = 'INSERT INTO ' + HistorySqlService.TABLENAME + ' (uid, date) VALUES (?,?)';
      var queue = [];
      for (var i = 0; i < data.length; i++) {
        queue.push(
          $cordovaSQLite.execute(db, query, [
            data[i].uid,
            data[i].date || ''
          ])
        );
      }
      return $q.all(queue);
    }

    function _update(uid) {

    }

    /**
     *
     * @returns {Promise}
     * @private
     */
    function _create() {
      return sqlLiteUtilsService.createTable(db, HistorySqlService.TABLENAME, '(uid integer primary key, date text)');
    }
  }
})();