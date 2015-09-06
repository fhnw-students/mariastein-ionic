(function () {
  'use strict';

  var namespace = 'kmsscan.services.stores';

  angular.module(namespace, [
    namespace + '.Objects',
    namespace + '.Images',
    namespace + '.Rooms'
  ]);

}());