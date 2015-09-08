(function () {
  'use strict';

  angular
    .module('kmsscan.services.sql.Rooms', [
      'kmsscan.utils.Logger',
      'kmsscan.utils.SqlLite',

      'kmsscan.services.stores.Rooms'
    ])
    .factory('roomsSqlService', RoomsSqlService);

  /**
   * Static Variables
   * @type {{IMAGES: string}}
   */
  RoomsSqlService.TABLENAME = 'rooms';

  /**
   * Service Class
   * @returns {{}}
   * @constructor
   */
  function RoomsSqlService($q, $cordovaSQLite, $ionicPlatform, Logger, roomsStoreService, sqlLiteUtilsService) {
    var log = new Logger('kmsscan.services.sql.Rooms');
    log.info('init');

    var db;
    $ionicPlatform.ready(function () {
      if (window.cordova) {
        db = $cordovaSQLite.openDB({name: 'kmsscan'});
        _create();
      }
    });

    var service = {
      sync: sync,
      getAll: getAll
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     * @name sync
     * @description
     * Renews the tables of the database and inserts the new data
     *
     * @param data
     * @returns {deferred.promise|{then, always}}
     */
    function sync(data) {
      var deferred = $q.defer();
      _truncateTables()
        .then(_create)
        .then(function () {
          return _insert(data);
        })
        .then(function () {
          return getAll();
        })
        .then(function (res) {
          roomsStoreService.set(res);
          deferred.resolve();
        })
        .catch(function (err) {
          log.error('sync()', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function getAll() {
      return _selectAll();
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////

    /**
     *
     * @returns {deferred.promise|{then, always}}
     * @private
     */
    function _selectAll() {
      return sqlLiteUtilsService.selectAll(db, RoomsSqlService.TABLENAME);
    }

    /**
     *
     * @param data
     * @returns {Promise}
     * @private
     */
    function _insert(data) {
      var query = 'INSERT INTO ' + RoomsSqlService.TABLENAME + ' (uid, title, position) VALUES (?,?,?)';
      var queue = [];
      for (var i = 0; i < data.length; i++) {
        queue.push(
          $cordovaSQLite.execute(db, query, [
            data[i].uid,
            data[i].title || '',
            data[i].position || 0
          ])
        );
      }
      return $q.all(queue);
    }

    /**
     *
     * @returns {Promise}
     * @private
     */
    function _truncateTables() {
      return sqlLiteUtilsService.truncateTable(db,RoomsSqlService.TABLENAME);
    }

    /**
     *
     * @returns {Promise}
     * @private
     */
    function _create() {
      return sqlLiteUtilsService.createTable(db, RoomsSqlService.TABLENAME, '(uid integer primary key, title text, position integer)');
    }
  }
})();