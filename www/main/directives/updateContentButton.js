/**
 * @name kmsUpdateContentButton
 * @module kmsscan.directives.UpdateContentButton
 * @author Gerhard Hirschfeld
 */
(function () {
  'use strict';

  angular.module('kmsscan.directives.UpdateContentButton', [
    'kmsscan.services.Sync'
  ])
    .controller('UpdateContentButtonDirectiveCtrl', UpdateContentButtonDirectiveController)
    .directive('kmsUpdateContentButton', UpdateContentButtonDirective);

  /**
   * @name kmsUpdateContentButton
   * @description
   * This directive creates the correct infoCard source path.
   *
   * @example
   * <kms-update-content-button></kms-update-content-button>
   */
  function UpdateContentButtonDirective() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'main/directives/updateContentButton.html',
      controller: 'UpdateContentButtonDirectiveCtrl as updateContentButton'
    };
  }

  function UpdateContentButtonDirectiveController(syncService) {
    var vm  = this;

    vm.submit = submit;

    ///////////////////////////////////////
    function submit() {
      syncService.run();
    }

  }


}());