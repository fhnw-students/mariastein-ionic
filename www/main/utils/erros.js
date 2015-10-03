/**
 * @name errorsUtilsService
 * @module kmsscan.utils.Errors
 * @author Gerhard Hirschfeld
 *
 * @description
 * TODO
 *
 */
(function () {
  'use strict';

  angular
    .module('kmsscan.utils.Errors', [])
    .factory('errorsUtilsService', ErrorsUtilsService);

  function ErrorsUtilsService() {

    var errors = {
      0: {
        text: 'MESSAGE.ERROR.UNKONW'
      },
      1: {
        text: 'MESSAGE.ERROR.NO_CONNECTION'
      },
      2: {
        text: 'MESSAGE.ERROR.HTTP_ERROR'
      }
    };

    return {
      get: get
    };

    ////////////////////////////////////////////////////////

    /**
     * @name get
     * @param number Number
     * @returns Object error
     */
    function get(number) {
      number = number || 0;
      return {
        number: number,
        error: errors[number]
      };
    }


  }

}());
