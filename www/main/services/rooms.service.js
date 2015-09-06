(function () {
  'use strict';

  angular
    .module('kmsscan.services.Rooms', [])
    .factory('roomsService', RoomsService);

  function RoomsService($q) {
    console.info('[RoomsService]');
    var service = {};

    return service;

    ////////////////


  }
})();