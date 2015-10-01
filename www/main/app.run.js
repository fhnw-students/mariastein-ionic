/**
 * @name app.run
 * @module kmsscan.run
 * @author Gerhard Hirschfeld
 *
 * @description
 *
 *
 */
(function () {
  'use strict';

  var namespace = 'kmsscan.run';

  angular.module(namespace, [
    'kmsscan.utils.Logger',
    'kmsscan.services.Sync',
    'kmsscan.services.Images'
  ])
    .run(run);

  function run($rootScope, $translate, Logger, syncService, imagesService) {
    var log = new Logger(namespace);

    // Global Declarations
    $rootScope.onLine = window.navigator.onLine;
    $rootScope.getImagePath = function (imageId) {
      return imagesService.getPath(imageId);
    };

    syncService.run();
    onLanguageChange();

    /////////////////////////////////////////
    function onLanguageChange() {
      $rootScope.$on('onLanguageChange', function (event, langKey) {
        $translate.use(langKey);
      });
    }

  }

}());