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
      sync: sync
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function sync(data) {
      var deferred = $q.defer();
      _truncateTables()
        .then(_create)
        .then(function () {
          return _insert(data);
        })
        //.then(function () {
        //  return getAll();
        //})
        //.then(function (res) {
        //  imagesStoreService.set(res);
        //  deferred.resolve();
        //})
        .catch(function (err) {
          log.error('sync()', err);
          deferred.reject(err);
        });
      return deferred.promise;




      //log.warn(data);
      //log.warn(data[0].originalResource.publicUrl);
      //
      //
      //var b = typo3Service.getImageBlob(data[0].originalResource.publicUrl);
      //log.warn(b);
      //
      //deferred.resolve();
      ////deferred.reject();
      //
      //return deferred.promise;
    }

    function getAll() {
      return [];
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////


    function _insert(data) {
      var query = 'INSERT INTO ' + ImagesSqlService.TABLENAME + ' (uid, data) VALUES (?,?)';
      var queue = [];
      for (var i = 0; i < data.length; i++) {
        var imageId = data[i].uid;
        var imageUrl = data[i].originalResource.publicUrl;
        queue.push(
          typo3Service.getImageBlob(imageUrl)
            .then(function (blob) {
              return $cordovaSQLite.execute(db, query, [
                imageId,
                blob
              ])
            })
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
      return sqlLiteUtilsService.truncateTable(db,ImagesSqlService.TABLENAME);
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
