(function() {
  'use strict';

  var namespace = 'kmsscan.services.stores';

  angular.module(namespace, [
    namespace + '.Settings',
    namespace + '.Pages',
    namespace + '.Images',
    namespace + '.Rooms'
  ]);

}());