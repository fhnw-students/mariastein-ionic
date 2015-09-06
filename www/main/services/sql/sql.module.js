(function () {
  'use strict';

  var namespace = 'kmsscan.services.sql';

  angular.module(namespace, [
    namespace + '.Objects',
    namespace + '.Rooms',
    namespace + '.Images'
  ]);

}());