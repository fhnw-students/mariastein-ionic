(function () {
  'use strict';

  angular.module('kmsscan.directives.NavMenuButton', [])
    .directive('kmsNavMenuButton', NavMenuButton);

  function NavMenuButton() {
    return {
      restrict:    'E',
      replace:     true,
      templateUrl: 'main/directives/navMenuButton.html'
    };
  }


}());