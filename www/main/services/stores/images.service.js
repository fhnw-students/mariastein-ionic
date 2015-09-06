(function () {
  'use strict';

  angular
    .module('kmsscan.services.stores.Images', [
      'kmsscan.services.stores.Images'
    ])
    .factory('imagesStoreService', ImagesStoreService);

  /**
   * Service Class
   * @param $q
   * @param $cordovaSQLite
   * @param $ionicPlatform
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function ImagesStoreService($q, imagesSqlService) {
    console.info('[ImagesStoreService]');
    var storage;


    // Public API
    var service = {};

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////


    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////


  }
})();