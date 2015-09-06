(function () {
  'use strict';

  angular
    .module('kmsscan.services.stores.Images', [])
    .factory('imagesStoreService', ImagesStoreService);

  /**
   * Service Class
   * @param $q
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function ImagesStoreService($q) {
    console.info('[ImagesStoreService]');
    var storage;


    // Public API
    var service = {
      init: init,
      getAll: getAll,
      get: get
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function init(data) {
      storage = data;
    }

    function getAll() {
      return storage;
    }

    function get(id) {
      return storage.filter(function (item) {
          return item.uid === id;
        })[0] || {};
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////


  }
})();