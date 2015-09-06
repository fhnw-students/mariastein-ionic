(function () {
  'use strict';

  var namespace = 'kmsscan.services';

  angular.module(namespace, [
    namespace + '.rest',
    namespace + '.sql',
    namespace + '.stores',

    namespace + '.History',
    namespace + '.News'
  ]);

}());