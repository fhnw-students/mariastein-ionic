(function() {
  'use strict';

  angular.module('kmsscan.views.Detail', [
      'kmsscan.utils.Logger',
      'kmsscan.services.stores.Pages',
      'kmsscan.services.stores.Settings'
    ])
    .config(StateConfig)
    .controller('DetailCtrl', DetailController);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.detail', {
        url: '/detail/:uid',
        views: {
          'menuContent': {
            templateUrl: 'main/views/detail.html',
            controller: 'DetailCtrl as detail'
          }
        }

      });
  }

  function DetailController($q, $timeout, $window, $stateParams, $ionicModal, $ionicSlideBoxDelegate, imagesStoreService,
    $ionicBackdrop, $ionicScrollDelegate, $rootScope, Logger, pagesStoreService, settingsStoreService, $scope) {
    var vm = this; // view-model
    var log = new Logger('kmsscan.views.Detail');
    vm.doc = {};
    vm.settings = {};
    vm.isPending = true;
    vm.hasFailed = false;
    vm.more = false;
    vm.zoomMin = 1;
    vm.enableZoom = false;
    vm.hgt = $window.innerHeight - 50;
    vm.hgt2 = $window.innerHeight - 145;

    vm.isReady = isReady;
    vm.showMore = showMore;
    vm.showLess = showLess;
    vm.showImages = showImages;
    vm.showModal = showModal;
    vm.closeModal = closeModal;
    vm.scrollTop = scrollTop;
    vm.zoom = zoom;
    vm.updateSlideStatus = updateSlideStatus;
    vm.getImagePath = getImagePath;

    if ($rootScope.syncIsActive) {
      $rootScope.$on('kmsscan.run.activate.succeed', activate);
    } else {
      activate();
    }

    settingsStoreService.onChange(function() {
      activate();
    });
    /////////////////////////////
    function activate() {
      settingsStoreService.get()
        .then(function(settings) {
          vm.settings = settings;
          return pagesStoreService.get($stateParams.uid, settings.language);
        })
        .then(function(doc) {
          log.debug('activate() -> succeed', doc);
          vm.doc = doc;
          vm.isPending = false;
          vm.hasFailed = false;
        })
        .catch(function(err) {
          log.error('Failed to load doc!', err)
          vm.isPending = false;
          vm.hasFailed = true;
        });
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }

    function showMore() {
      vm.more = true;
    };

    function showLess() {
      vm.more = false;
    };

    function showImages(index) {
      vm.activeSlide = index;
      vm.showModal('main/views/modalPreview.html');
    };

    function showModal(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
          scope: $scope
        })
        .then(function(modal) {
          vm.modal = modal;
          vm.modal.show();
        });
    };

    function closeModal() {
      vm.modal.hide();
      vm.modal.remove()
    };

    function scrollTop() {
      if (vm.settings.zooming) {
        vm.enableZoom = true;
        $ionicScrollDelegate.$getByHandle('scrollMain')
          .scrollTo(0, 200, true);
      }
    };

    function updateSlideStatus(slide) {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide)
        .getScrollPosition()
        .zoom;
      if (zoomFactor == vm.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };

    function zoom(slide) {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide)
        .getScrollPosition()
        .zoom;
      if (zoomFactor == vm.zoomMin) {
        $ionicScrollDelegate.$getByHandle('scrollHandle' + slide)
          .zoomBy(2, true);
      } else {
        $ionicScrollDelegate.$getByHandle('scrollHandle' + slide)
          .zoomTo(1, true);
      }
    };

    function getImagePath(imageId){
      return imagesStoreService.getPath(imageId);
    }

  }

}());