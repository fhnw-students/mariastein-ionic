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

  function DetailController($q, $timeout, $window, $stateParams, $ionicModal, $ionicSlideBoxDelegate,
    $ionicBackdrop, $ionicScrollDelegate, $rootScope, Logger, pagesStoreService, settingsStoreService) {
    var vm = this; // view-model
    var log = new Logger('kmsscan.views.Detail');
    vm.doc = {};
    vm.isPending = true;
    vm.hasFailed = false;

    vm.isReady = isReady;

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

    // init();

    // vm.item = {};
    // vm.more = false;

    // vm.showMore = function() {
    //   if (!vm.more) {
    //     $timeout(function() {
    //       vm.more = true;
    //     });
    //   }
    // };

    // vm.showLess = function() {
    //   if (vm.more) {
    //     $timeout(function() {
    //       vm.more = false;
    //     });
    //   }
    // };

    // //historyService.get($stateParams.id)
    // //  .then(function(result) {
    // //    vm.item = result;
    // //  });

    // vm.allImages = [{
    //   src: 'img/init.png'
    // }, {
    //   src: 'img/welcome.jpg'
    // }, {
    //   src: 'img/init.png'
    // }];

    // vm.zoomMin = 1;
    // vm.zooming = $rootScope.settings.zooming;
    // vm.enableZoom = false;
    // vm.hgt = $window.innerHeight - 50;
    // vm.hgt2 = $window.innerHeight - 145;

    // vm.showImages = function(index) {
    //   vm.activeSlide = index;
    //   vm.showModal('main/views/modalPreview.html');
    // };

    // vm.showModal = function(templateUrl) {
    //   $ionicModal.fromTemplateUrl(templateUrl, {
    //     scope: vm
    //   }).then(function(modal) {
    //     vm.modal = modal;
    //     vm.modal.show();
    //   });
    // };

    // vm.closeModal = function() {
    //   vm.modal.hide();
    //   vm.modal.remove()
    // };

    // vm.updateSlideStatus = function(slide) {
    //   var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    //   if (zoomFactor == vm.zoomMin) {
    //     $ionicSlideBoxDelegate.enableSlide(true);
    //   } else {
    //     $ionicSlideBoxDelegate.enableSlide(false);
    //   }
    // };

    // vm.zoom = function(slide) {
    //   var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    //   if (zoomFactor == $scope.zoomMin) {
    //     $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).zoomBy(2, true);
    //   } else {
    //     $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).zoomTo(1, true);
    //   }
    // };

    // vm.scrollTop = function() {
    //   if ($rootScope.settings.zooming) {
    //     $scope.enableZoom = true;
    //     $ionicScrollDelegate.$getByHandle('scrollMain').scrollTo(0, 200, true);
    //   }
    // };

    // function init() {
    //   var deferred = $q.defer();
    //   $localForage.getItem(SETTINGS_STORAGE_KEY)
    //     .then(function(result) {
    //       if (result !== null) {
    //         $rootScope.settings = _.assign($rootScope.settings, JSON.parse(result));
    //       }
    //       deferred.resolve($rootScope.settings);
    //     })
    //     .catch(function(err) {
    //       $log.error(err);
    //       deferred.reject(err);
    //     });
    //   return deferred.promise;
    // }

  }

}());