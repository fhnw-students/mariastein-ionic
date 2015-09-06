(function () {
  'use strict';

  angular
    .module('kmsscan.services.stores.Rooms', [])
    .factory('roomsStoreService', RoomsStoreService);

  /**
   * Service Class
   * @param $q
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function RoomsStoreService($q) {
    console.info('[RoomsStoreService]');
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