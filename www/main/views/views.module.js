(function () {
  'use strict';

  var namespace = 'kmsscan.views';

  angular.module(namespace, [
    namespace + '.Menu',
    namespace + '.NotFound',
    namespace + '.Welcome',
    namespace + '.Tutorial',
    namespace + '.Contact',
    namespace + '.MapPage',
    namespace + '.Map',
    namespace + '.Scan',
    namespace + '.Detail',
    namespace + '.History',
    namespace + '.News',
    namespace + '.Settings'

  ]);

}());