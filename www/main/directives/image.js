/**
 * @name kmsImage
 * @module kmsscan.directives.Image
 * @author Gerhard Hirschfeld
 */
(function () {
  'use strict';

  angular.module('kmsscan.directives.Image', [
    'kmsscan.services.Images'
  ])
    .directive('kmsImage', ImageDirective);

  /**
   * @name kmsImage
   * @description
   * This directive creates the correct image source path.
   *
   * @example
   * <kms-image image-id="doc.image[0]"></kms-image>
   */
  function ImageDirective(imagesService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'main/directives/image.html',
      scope: {
        imageId: '='
      },
      link: function (scope) {
        scope.imageSrc = imagesService.getPath(scope.imageId);
      }
    };
  }


}());