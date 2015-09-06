(function() {
  'use strict';

  angular.module('kmsscan.views.Detail', [
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

  function DetailController($window, $stateParams, $ionicModal, $ionicSlideBoxDelegate, $ionicBackdrop, $ionicScrollDelegate) {
    var vm = this; // view-model or $scope
    vm.item = {};
    vm.more = false;

    vm.showMore = function(){
      if (!vm.more){
        vm.more = true;
      }
    };

    vm.showLess = function(){
      if (vm.more){
        vm.more = false;
      }
    };

    //historyService.get($stateParams.id)
    //  .then(function(result) {
    //    vm.item = result;
    //  });

    vm.allImages = [{
      src: 'img/init.png'
    }, {
      src: 'img/welcome.jpg'
    }, {
      src: 'img/init.png'
    }];

    vm.zoomMin = 1;

    vm.hgt = $window.innerHeight-50;

    vm.showImages = function(index) {
      vm.activeSlide = index;
      vm.showModal('main/views/modalPreview.html');
    };

    vm.showModal = function(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: vm
      }).then(function(modal) {
        vm.modal = modal;
        vm.modal.show();
      });
    };

    vm.closeModal = function() {
      vm.modal.hide();
      vm.modal.remove()
    };

    vm.updateSlideStatus = function(slide) {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == vm.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };

    vm.zoom = function(slide){
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {
        $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).zoomBy(2, true);
      } else {
        $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).zoomTo(1, true);
      }
    };

  }

}());