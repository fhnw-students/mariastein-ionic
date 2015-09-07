(function () {
  'use strict';

  angular
    .module('kmsscan.services.sql.Images', [
      'kmsscan.utils.Logger',

      'kmsscan.services.stores.Images'
    ])
    .factory('imagesSqlService', ImagesSqlService);

  /**
   * Static Variables
   * @type {{IMAGES: string}}
   */
  ImagesSqlService.TABLENAME = {
    IMAGES: 'images'
  };

  /**
   * Service Class
   * @param $q
   * @param $cordovaSQLite
   * @param $ionicPlatform
   * @returns {{}}
   * @constructor
   */
  function ImagesSqlService($q, $cordovaSQLite, $ionicPlatform, Logger, imagesStoreService) {
    var log = new Logger('kmsscan.services.sql.Images');
    log.info('init');

    var db;
    $ionicPlatform.ready(function () {
      if (window.cordova) {
        db = $cordovaSQLite.openDB({name: 'kmsscan'});
        //_create();
      }
    });

    var service = {};

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////


    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////


  }
})();