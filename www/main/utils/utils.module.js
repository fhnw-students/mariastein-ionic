(function () {
  'use strict';

  var namespace = 'kmsscan.utils';

  angular
    .module(namespace, [
      namespace + '.Logger',
      namespace + '.Helpers',
      namespace + '.SqlLite'
    ]);

})();
