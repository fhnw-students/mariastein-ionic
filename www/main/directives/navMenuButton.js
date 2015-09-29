/**
 * @name kmsNavMenuButton
 * @module kmsscan.directives.NavMenuButton
 * @author Gerhard Hirschfeld
 */
(function () {
  'use strict';

  angular.module('kmsscan.directives.NavMenuButton', [])
    .directive('kmsNavMenuButton', NavMenuButton);

  /**
   * @name kmsNavMenuButton
   * @description
   * This directive is a template for the menu button
   *
   * @example
   * <kms-nav-menu-button></kms-nav-menu-button>
   */
  function NavMenuButton() {
    return {
      restrict:    'E',
      replace:     true,
      templateUrl: 'main/directives/navMenuButton.html'
    };
  }


}());