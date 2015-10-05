/**
 * @name imagesService
 * @module kmsscan.services.Images
 * @author Gerhard Hirschfeld
 *
 * @description
 * This Service Class handel's the images of the typo3 pages and rooms data.
 * It is used to sync the images and starts the downloads. Moreover it can
 * give you the path to the saved images on the device.
 *
 */
(function () {
  'use strict';

  var namespace = 'kmsscan.services.Images';

  angular
    .module(namespace, [
      'pouchdb',
      'kmsscan.utils.Logger',
      'kmsscan.services.rest.Typo3'
    ])
    .factory('imagesService', ImagesService);

  ImagesService.PLACEHOLDER_IMAGE = 'img/init.png';

  function ImagesService($q, Logger, typo3Service) {
    var log = new Logger(namespace);
    log.debug('init');

    // Public API
    var service = {
      getPath: getPath,
      download: download
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////

    /**
     * @name getPath
     * @description
     * Returns the file-path to the image.
     *
     * @param uid Number
     * @returns String filepath
     */
    function getPath(uid) {
      if (window.cordova) {
        if (uid) {
          var targetPath = '';
          if (ionic.Platform.isIOS()) {
            targetPath = cordova.file.documentsDirectory;
          }
          if (ionic.Platform.isAndroid()) {
            targetPath = cordova.file.applicationStorageDirectory;
          }

          targetPath += uid + '.png';
          return targetPath;
        } else {
          return '';
        }
      }
      return ImagesService.PLACEHOLDER_IMAGE;
    }

    /**
     * @name download
     * @description
     * This method is called by app.run.js for the synchronisation. It parses the images of
     * the pages and rooms. Afterwards it downloads the images from the typo3 backend.
     *
     * @param images Objejt
     * @returns Promise{then, always} images
     */
    function download(images) {
      var queue = [];
      for (var key in images) {
        if (key) {
          queue.push(typo3Service.downloadImage(images[key], getPath(key)));
        }
      }
      return $q.all(queue);
    }


  }
})();