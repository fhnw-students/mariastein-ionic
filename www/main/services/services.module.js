(function () {
  'use strict';

  var namespace = 'kmsscan.services';

  angular.module(namespace, [
    namespace + '.rest',
    namespace + '.stores',

    namespace + '.Images'

  ]);

}());