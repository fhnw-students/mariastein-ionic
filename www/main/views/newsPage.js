(function () {
  'use strict';

  var namespace = 'kmsscan.views.NewsPage';

  angular.module(namespace, [
    'kmsscan.utils.Logger',
    'kmsscan.services.stores.Settings'
  ])
      .config(StateConfig)
      .controller('NewsPageCtrl', NewsPageController);

  function StateConfig($stateProvider) {
    $stateProvider
        .state('menu.newsPage', {
          url: '/newsPage/:uid',
          views: {
            'menuContent': {
              templateUrl: 'main/views/newsPage.html',
              controller: 'NewsPageCtrl as newsPage'
            }
          }

        });
  }

  function NewsPageController($window, $stateParams, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate,
                            $rootScope, Logger, settingsStoreService, $scope) {
    var vm = this; // view-model
    var log = new Logger(namespace);
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
    vm.showImages = showImages;
    vm.showModal = showModal;
    vm.closeModal = closeModal;
    vm.scrollTop = scrollTop;
    vm.zoom = zoom;
    vm.updateSlideStatus = updateSlideStatus;

    if ($rootScope.syncIsActive) {
      $rootScope.$on('kmsscan.run.activate.succeed', activate);
    } else {
      activate();
    }

    var eventIndexOnChange = settingsStoreService.onChange(function () {
      activate();
    });

    $scope.$on('$destroy', function () {
      settingsStoreService.offChange(eventIndexOnChange);
    });
    /////////////////////////////
    function activate() {
      settingsStoreService.get()
          .then(function (settings) {
            vm.settings = settings;
            return newsStoreService.get($stateParams.uid, settings.language);
          })
          .then(function (doc) {
            log.debug('activate() -> succeed', doc);
            vm.doc = doc;
            vm.isPending = false;
            vm.hasFailed = false;
          })
          .catch(function (err) {
            log.error('Failed to load doc!', err);
            vm.isPending = false;
            vm.hasFailed = true;
          });
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }


    function showImages(index) {
      vm.activeSlide = index;
      vm.showModal('main/views/modalPreview.html');
    }

    function showModal(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope
      })
          .then(function (modal) {
            vm.modal = modal;
            vm.modal.show();
          });
    }

    function closeModal() {
      vm.modal.hide();
      vm.modal.remove();
    }

    function scrollTop() {
      if (vm.settings.zooming) {
        vm.enableZoom = true;
        $ionicScrollDelegate.$getByHandle('scrollMain')
            .scrollTo(0, 200, true);
      }
    }

    function updateSlideStatus(slide) {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide)
          .getScrollPosition()
          .zoom;
      if (zoomFactor === vm.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    }

    function zoom(slide) {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide)
          .getScrollPosition()
          .zoom;
      if (zoomFactor === vm.zoomMin) {
        $ionicScrollDelegate.$getByHandle('scrollHandle' + slide)
            .zoomBy(2, true);
      } else {
        $ionicScrollDelegate.$getByHandle('scrollHandle' + slide)
            .zoomTo(1, true);
      }
    }

  }

}());


/**


 pagesStoreService.get(uid, langKey)
 .then(function (result) {
                log.warn('getNews', result);
              })
 .catch(function (err) {
                log.error('getNews', err);
              });

 **/