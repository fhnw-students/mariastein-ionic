(function () {
  'use strict';

  angular
    .module('kmsscan.services.sql.Images', [])
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
  function ImagesSqlService($q, $cordovaSQLite, $ionicPlatform) {
    console.info('[ImagesSqlService]');
    var service = {};

    return service;

    ////////////////


  }
})();