(function () {
  'use strict';

  angular
    .module('kmsscan.services.sql.Images', [
      'kmsscan.utils.Logger',
      'kmsscan.utils.SqlLite',

      'kmsscan.services.rest.Typo3',
      'kmsscan.services.stores.Images'
    ])
    .factory('imagesSqlService', ImagesSqlService);

  /**
   * Static Variables
   * @type {{IMAGES: string}}
   */
  ImagesSqlService.TABLENAME = 'images';

  /**
   * Service Class
   * @param $q
   * @param $cordovaSQLite
   * @param $ionicPlatform
   * @returns {{}}
   * @constructor
   */
  function ImagesSqlService($q, $cordovaSQLite, $ionicPlatform, Logger, sqlLiteUtilsService, typo3Service, imagesStoreService) {
    var log = new Logger('kmsscan.services.sql.Images');
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
      get: get
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function sync(data) {
      var deferred = $q.defer();
      _truncateTables()
        .then(_create)
        .then(function () {
          return _inserts(data);
        })
        .then(function () {
          deferred.resolve();
        })
        .catch(function (err) {
          log.error('sync()', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function get(uid) {
      return _select(uid);
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    function _select(uid) {
      var self = this;
      var deferred = $q.defer();
      var query = 'SELECT * FROM ' + ImagesSqlService.TABLENAME + ' WHERE uid = ' + uid;
      $cordovaSQLite.execute(db, query).then(function (res) {
        log.info('select', res);
        deferred.resolve(self.parseRawSqlObjects(res));
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function _inserts(data) {
      var queue = [];
      for (var i = 0; i < data.length; i++) {
        var imageId = data[i].uid;
        var imageUrl = data[i].originalResource.publicUrl;
        queue.push(
          _insert(imageId, imageUrl)
        );
      }
      return $q.all(queue);
    }

    function _insert(imageId, imageUrl) {
      var deferred = $q.defer();
      var query = 'INSERT INTO ' + ImagesSqlService.TABLENAME + ' (uid, data) VALUES (?,?)';
      typo3Service.getImageBlob(imageUrl)
        .then(function (blob) {
          return $cordovaSQLite.execute(db, query, [
            imageId,
            blob
          ])
        })
        .then(function (result) {
          deferred.resolve(result);
        })
        .catch(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    /**
     *
     * @returns {Promise}
     * @private
     */
    function _truncateTables() {
      return sqlLiteUtilsService.truncateTable(db, ImagesSqlService.TABLENAME);
    }

    /**
     *
     * @returns {Promise}
     * @private
     */
    function _create() {
      return sqlLiteUtilsService.createTable(db, ImagesSqlService.TABLENAME, '(uid integer primary key, data blob)');
    }

  }
})();
//function _getBlob(url) {
//  var deferred = $q.defer();
//
//
//  deferred.resolve();
//  deferred.reject();
//
//  return deferred.promise;
//
//
//  //url = "http://kloster-mariastein.business-design.ch/"+url;
//  //// Simulate a call to Dropbox or other service that can
//  //// return an image as an ArrayBuffer.
//  //var xhr = new XMLHttpRequest();
//  //
//  //// Use JSFiddle logo as a sample image to avoid complicating
//  //// this example with cross-domain issues.
//  //xhr.open( "GET", url, true );
//  //
//  //// Ask for the result as an ArrayBuffer.
//  //xhr.responseType = "arraybuffer";
//  //
//  //xhr.onload = function( e ) {
//  //  // Obtain a blob: URL for the image data.
//  //  var arrayBufferView = new Uint8Array( this.response );
//  //  var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
//  //  return blob;
//  //  //var urlCreator = window.URL || window.webkitURL;
//  //  //var imageUrl = urlCreator.createObjectURL( blob );
//  //  //var img = document.querySelector( "#photo" );
//  //  //img.src = imageUrl;
//  //};
//  //
//  //xhr.send();
//}
