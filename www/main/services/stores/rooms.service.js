(function () {
  'use strict';

  angular
    .module('kmsscan.services.stores.Rooms', [
      'kmsscan.services.stores.Rooms'
    ])
    .factory('roomsStoreService', RoomsStoreService);

  /**
   * Service Class
   * @param $q
   * @param $cordovaSQLite
   * @param $ionicPlatform
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function RoomsStoreService($q, roomsSqlService) {
    console.info('[RoomsStoreService]');
    var storage;


    // Public API
    var service = {};

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////


    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////


  }
})();