(function () {
  'use strict';

  angular
    .module('kmsscan.utils.SqlLite', [])
    .service('sqlLiteUtilsService', SqlLiteUtilsService);

  function SqlLiteUtilsService($q, $cordovaSQLite) {

    /**
     *
     * @param db
     * @param tableName
     * @returns {deferred.promise|{then, always}}
     */
    this.select = function (db, tableName, where) {
      var self = this;
      var deferred = $q.defer();
      var query = 'SELECT * FROM ' + tableName + ' WHERE ' + where;
      $cordovaSQLite.execute(db, query).then(function (res) {
        deferred.resolve(self.parseRawSqlObjects(res));
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    /**
     *
     * @param db
     * @param tableName
     * @returns {deferred.promise|{then, always}}
     */
    this.selectAll = function (db, tableName) {
      var self = this;
      var deferred = $q.defer();
      var query = 'SELECT * FROM ' + tableName;
      $cordovaSQLite.execute(db, query).then(function (res) {
        deferred.resolve(self.parseRawSqlObjects(res));
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    /**
     *
     * @param db
     * @param tableName
     * @returns {*}
     */
    this.truncateTable = function (db, tableName) {
      return $cordovaSQLite.execute(db, 'DROP TABLE ' + tableName)
    };

    /**
     *
     * @param db
     * @param tableName
     * @param values
     * @returns {*}
     */
    this.createTable = function (db, tableName, values) {
      return $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS ' + tableName + ' ' + values)
    };

    /**
     *
     * @param rawSqlResult
     * @returns {Array}
     */
    this.parseRawSqlObjects = function (rawSqlResult) {
      var data = [];
      var rows = angular.copy(rawSqlResult.rows);
      for (var i = 0; i < rows.length; i++) {
        data.push(rows.item(i));
      }
      return data;
    };

  }

}());
