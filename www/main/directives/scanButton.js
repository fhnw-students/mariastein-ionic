/**
 * @name kmsScanButton
 * @module kmsscan.directives.ScanButton
 * @author Gerhard Hirschfeld
 */
(function () {
  'use strict';

  angular.module('kmsscan.directives.ScanButton', [])
    .directive('kmsScanButton', ScanButton);

  /**
   * @name kmsScanButton
   * @description
   * This directive is a template for the scan button
   *
   * @example
   * <kms-scan-button></kms-scan-button>
   */
  function ScanButton() {
    return {
      restrict:    'E',
      replace:     true,
      templateUrl: 'main/directives/scanButton.html'
    };
  }


}());