/**
 * @name kmsInfoCard
 * @module kmsscan.directives.InfoCard
 * @author Gerhard Hirschfeld
 */
(function () {
  'use strict';

  angular.module('kmsscan.directives.InfoCard', [])
    .directive('kmsInfoCard', InfoCardDirective);

  /**
   * @name kmsInfoCard
   * @description
   * This directive creates the correct infoCard source path.
   *
   * @example
   * <kms-info-card message="LABEL.MESSAGE"></kms-info-card>
   */
  function InfoCardDirective() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'main/directives/infoCard.html',
      scope: {
        message: '@'
      }
    };
  }


}());