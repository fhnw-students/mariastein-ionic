(function () {
  'use strict';

  angular.module('kmsscan.directives.Spinner', [])
    .directive('kmsSpinner', Spinner);

  function Spinner() {
    return {
      restrict:    'E',
      replace:     true,
      templateUrl: 'main/directives/spinner.html'
    };
  }


}());