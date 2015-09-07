(function() {
  'use strict';

  angular.module('kmsscan.views.Detail', [
    'kmsscan.services.History'
  ])
    .config(StateConfig)
    .controller('DetailCtrl', DetailController);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.detail', {
        url: '/detail/:id',
        views: {
          'menuContent': {
            templateUrl: 'main/views/detail.html',
            controller: 'DetailCtrl as detail'
          }
        }

      });
  }

  function DetailController($q, $window, $stateParams, historyService, $ionicModal, $ionicSlideBoxDelegate, $scope, $ionicBackdrop, $ionicScrollDelegate, SETTINGS_STORAGE_KEY, $localForage, $rootScope) {
    var vm = this; // view-model
    init();

    vm.item = {};
    vm.more = false;

    vm.showMore = function(){
      if (!vm.more){
        vm.more = true;
      }
    }
    vm.showLess = function(){
      if (vm.more){
        vm.more = false;
      }
    }

    historyService.get($stateParams.id)
      .then(function(result) {
        vm.item = result;
      });

    $scope.allImages = [{
      src: 'img/init.png'
    }, {
      src: 'img/welcome.jpg'
    }, {
      src: 'img/init.png'
    }];

    $scope.zoomMin = 1;
    $scope.zooming = $rootScope.settings.zooming;
    $scope.hgt = $window.innerHeight-50;

    $scope.showImages = function(index) {
      $scope.activeSlide = index;
      $scope.showModal('main/views/modalPreview.html');
    };

    $scope.showModal = function(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    }

    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.modal.remove()
    };

    $scope.updateSlideStatus = function(slide) {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };

    $scope.zoom = function(slide){
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {
        $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).zoomBy(2, true);
      } else {
        $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).zoomTo(1, true);
      }
    }

    function init() {
      var deferred = $q.defer();
      $localForage.getItem(SETTINGS_STORAGE_KEY)
          .then(function (result) {
            if (result !== null) {
              $rootScope.settings = _.assign($rootScope.settings,  JSON.parse(result));
            }
            deferred.resolve($rootScope.settings);
          })
          .catch(function (err) {
            $log.error(err);
            deferred.reject(err);
          });
      return deferred.promise;
    }

  }

}());