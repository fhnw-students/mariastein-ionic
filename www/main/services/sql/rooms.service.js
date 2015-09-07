(function () {
  'use strict';

  angular
    .module('kmsscan.services.sql.Rooms', [
      'kmsscan.utils.Logger',

      'kmsscan.services.stores.Rooms'
    ])
    .factory('roomsSqlService', RoomsSqlService);

  /**
   * Static Variables
   * @type {{IMAGES: string}}
   */
  RoomsSqlService.TABLENAME = {
    IMAGES: 'rooms'
  };

  /**
   * Service Class
   * @param $q
   * @param $cordovaSQLite
   * @param $ionicPlatform
   * @returns {{}}
   * @constructor
   */
  function RoomsSqlService($q, $cordovaSQLite, $ionicPlatform, Logger, roomsStoreService) {
    var log = new Logger('kmsscan.services.sql.Rooms');
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

    ////////////////


  }
})();