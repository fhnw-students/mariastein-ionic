/**
 * @name kmsSpinner
 * @module kmsscan.directives.Spinner
 * @author Gerhard Hirschfeld
 */
(function () {
  'use strict';

  angular.module('kmsscan.directives.Spinner', [])
    .directive('kmsSpinner', Spinner);

  /**
   * @name kmsSpinner
   * @description
   * This directive is a template for the spinner
   *
   * @example
   * <kms-spinner></kms-spinner>
   */
  function Spinner() {
    return {
      restrict:    'E',
      replace:     true,
      templateUrl: 'main/directives/spinner.html'
    };
  }


}());