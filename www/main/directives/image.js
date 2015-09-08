(function () {
  'use strict';

  angular.module('kmsscan.directives.Image', [])
    .directive('kmsImage', Image);

  function Image(imagesStoreService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'main/directives/image.html',
      scope: {
        imageId: '='
      },
      link: function (scope, element, attrs) {

        scope.imageSrc = imagesStoreService.getPath(scope.imageId);

        scope.getImageSrc = function () {
          return imagesStoreService.getPath(scope.imageId);
        };


      }
    };
  }


}());