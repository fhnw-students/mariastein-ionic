(function () {
  'use strict';

  angular
    .module('kmsscan.services.sql.History', [
      'kmsscan.utils.Logger',
      'kmsscan.utils.SqlLite'
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
  function HistorySqlService($q, $cordovaSQLite, $ionicPlatform, Logger, sqlLiteUtilsService) {
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
      select: select,
      create: create,
      update: update
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function select(uid) {
      return sqlLiteUtilsService.select(db, HistorySqlService.TABLENAME, 'uid = ' + uid);
    }

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
          deferred.resolve(res);
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
     * @returns {Promise}
     * @private
     */
    function _create() {
      return sqlLiteUtilsService.createTable(db, HistorySqlService.TABLENAME, '(uid integer primary key, date text)');
    }
  }
})();