(function () {
  'use strict';

  angular
    .module('kmsscan.services.stores.Objects', [
      'kmsscan.services.stores.Objects'
    ])
    .factory('objectsStoreService', ObjectsStoreService);

  /**
   * Service Class
   * @param $q
   * @param $cordovaSQLite
   * @param $ionicPlatform
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function ObjectsStoreService($q, objectsSqlService) {
    console.info('[ObjectsStoreService]');
    var storage;


    // Public API
    var service = {};

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////


    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////


  }
})();