(function () {
  'use strict';

  angular
    .module('kmsscan.services.sql.Rooms', [])
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
  function RoomsSqlService($q, $cordovaSQLite, $ionicPlatform) {
    console.info('[RoomsSqlService]');
    var service = {};

    return service;

    ////////////////


  }
})();