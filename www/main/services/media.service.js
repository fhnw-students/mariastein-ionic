(function () {
  'use strict';

  angular
    .module('kmsscan.services.Media', [])
    .factory('mediaService', MediaService);

  function MediaService($q) {
    console.info('[MediaService]');
    var service = {};

    return service;

    ////////////////


  }
})();