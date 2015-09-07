(function () {
  'use strict';

  angular
    .module('kmsscan.services.sql.Objects', [
      'kmsscan.utils.Logger',

      'kmsscan.services.stores.Objects'
    ])
    .factory('objectsSqlService', ObjectsSqlService);

  /**
   * Static Variables
   * @type {{OBJECTS: string, OBJECTS_HAS_IMAGES: string}}
   */
  ObjectsSqlService.TABLENAME = {
    OBJECTS: 'objects',
    OBJECTS_HAS_IMAGES: 'objects_has_media'
  };

  /**
   * Service Class
   * @param $q
   * @param $cordovaSQLite
   * @param $ionicPlatform
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function ObjectsSqlService($q, $cordovaSQLite, $ionicPlatform, Logger, objectsStoreService) {
    var log = new Logger('kmsscan.services.sql.Objects');
    log.info('init');

    var db;
    $ionicPlatform.ready(function () {
      if (window.cordova) {
        db = $cordovaSQLite.openDB({name: 'kmsscan'});
        _create();
      }
    });

    // Public API
    var service = {
      sync: sync,
      getAll: getAll
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     * @name getAll
     * @description
     * selects all values from the SQL-Lite database and parses them for the application
     *
     * @returns {deferred.promise|{then, always}}
     */
    function getAll() {
      var deferred = $q.defer();
      $q.all([
        _selectAllObjects(),
        _selectAllObjectsHasMedia()
      ])
        .then(function (results) {
          var data = results[0];
          data.map(function (item) {
            item.media = results[1]
              .filter(function (media) {
                return media.uid === item.uid;
              })
              .map(function (media) {
                return media.mediaId;
              });
            return item;
          });
          deferred.resolve(data);
        });
      return deferred.promise;
    }

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
          objectsStoreService.set(res);
          deferred.resolve();
        })
        .catch(function (err) {
          log.error('sync()', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     *
     * @returns {deferred.promise|{then, always}}
     * @private
     */
    function _selectAllObjects() {
      var deferred = $q.defer();
      var query = 'SELECT * FROM ' + ObjectsSqlService.TABLENAME.OBJECTS + '';
      $cordovaSQLite.execute(db, query).then(function (res) {
        var data = _parseRawSqlObjects(res);
        deferred.resolve(data);
      }, function (err) {
        log.error('_selectAllObjects', err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    /**
     *
     * @returns {deferred.promise|{then, always}}
     * @private
     */
    function _selectAllObjectsHasMedia() {
      var deferred = $q.defer();
      var query = 'SELECT * FROM ' + ObjectsSqlService.TABLENAME.OBJECTS_HAS_IMAGES + '';
      $cordovaSQLite.execute(db, query).then(function (res) {
        var data = _parseRawSqlObjects(res);
        deferred.resolve(data);
      }, function (err) {
        log.error('_selectAllObjectsHasMedia()', err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    /**
     *
     * @param rawSqlResult
     * @returns {Array}
     * @private
     */
    function _parseRawSqlObjects(rawSqlResult) {
      var data = [];
      for (var i = 0; i < rawSqlResult.rows.length; i++) {
        data.push(rawSqlResult.rows.item(i));
      }
      return data;
    }

    /**
     *
     * @param data
     * @returns {Promise}
     * @private
     */
    function _insert(data) {
      return $q.all([
        _insertObjects(data),
        _insertMedia(data)
      ]);
    }

    /**
     *
     * @param data
     * @returns {Promise}
     * @private
     */
    function _insertMedia(data) {
      var query = 'INSERT INTO ' + ObjectsSqlService.TABLENAME.OBJECTS_HAS_IMAGES + ' (uid, mediaId) VALUES (?,?)';
      var queue = [];
      for (var i = 0; i < data.length; i++) {
        for (var n = 0; n < data[i].image.length; n++) {
          queue.push(
            $cordovaSQLite.execute(db, query, [
              data[i].uid,
              data[i].image[n].uid
            ])
          );
        }
      }
      return $q.all(queue);
    }

    /**
     *
     * @param data
     * @returns {Promise}
     * @private
     */
    function _insertObjects(data) {
      var query = 'INSERT INTO ' + ObjectsSqlService.TABLENAME.OBJECTS + ' (uid, title, content, teaser, roomId, qrcode) VALUES (?,?,?,?,?,?)';
      var queue = [];
      for (var i = 0; i < data.length; i++) {
        queue.push(
          $cordovaSQLite.execute(db, query, [
            data[i].uid,
            data[i].title || '',
            data[i].content || '',
            data[i].teaser || '',
            data[i].room.uid || null,
            data[i].qrcode || null
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
      return $q.all([
        $cordovaSQLite.execute(db, 'DROP TABLE ' + ObjectsSqlService.TABLENAME.OBJECTS + ''),
        $cordovaSQLite.execute(db, 'DROP TABLE ' + ObjectsSqlService.TABLENAME.OBJECTS_HAS_IMAGES + '')
      ]);
    }

    /**
     *
     * @returns {Promise}
     * @private
     */
    function _create() {
      return $q.all([
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS ' + ObjectsSqlService.TABLENAME.OBJECTS + ' (uid integer primary key, title text, content text, teaser text, roomId integer, qrcode text)'),
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS ' + ObjectsSqlService.TABLENAME.OBJECTS_HAS_IMAGES + ' (uid integer, mediaId integer)')
      ]);
    }

  }
})();