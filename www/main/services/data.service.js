(function () {
  'use strict';

  angular
    .module('kmsscan.services.Data', [])
    .factory('dataService', DataService);

  function DataService($q, $cordovaSQLite) {
    console.info('[DataService]');

    var db = $cordovaSQLite.openDB({name: 'kmsscan.data'});
    _create();

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
        _selectAllData(),
        _selectAllDataHasMedia()
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
          deferred.resolve();
        })
        .catch(function (err) {
          console.error('[dataService.sync()]', err);
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
    function _selectAllData() {
      var deferred = $q.defer();
      var query = "SELECT * FROM data";
      $cordovaSQLite.execute(db, query).then(function (res) {
        var data = _parseRawSqlData(res);
        deferred.resolve(data);
      }, function (err) {
        console.error(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    /**
     *
     * @returns {deferred.promise|{then, always}}
     * @private
     */
    function _selectAllDataHasMedia() {
      var deferred = $q.defer();
      var query = "SELECT * FROM dataHasMedia";
      $cordovaSQLite.execute(db, query).then(function (res) {
        var data = _parseRawSqlData(res);
        deferred.resolve(data);
      }, function (err) {
        console.error(err);
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
    function _parseRawSqlData(rawSqlResult) {
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
        _insertData(data),
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
      var query = "INSERT INTO dataHasMedia (uid, mediaId) VALUES (?,?)";
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
    function _insertData(data) {
      var query = "INSERT INTO data (uid, title, content, teaser, roomId, qrcode) VALUES (?,?,?,?,?,?)";
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
        $cordovaSQLite.execute(db, "DROP TABLE data"),
        $cordovaSQLite.execute(db, "DROP TABLE dataHasMedia")
      ]);
    }

    /**
     *
     * @returns {Promise}
     * @private
     */
    function _create() {
      return $q.all([
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS data (uid integer primary key, title text, content text, teaser text, roomId integer, qrcode text)"),
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS dataHasMedia (uid integer, mediaId integer)")
      ]);
    }

  }
})();