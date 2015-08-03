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

  function DetailController($stateParams, historyService, $ionicModal, $ionicSlideBoxDelegate, $scope) {
    var vm = this; // view-model
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

    $ionicSlideBoxDelegate.slide(0);

    vm.next = function() {
      $ionicSlideBoxDelegate.next();
    };

    vm.slideChanged = function(index) {
      $scope.slideIndex = index;
    };

    console.log(vm.item);
    console.log($stateParams);

    $ionicModal.fromTemplateUrl('main/views/modalPreview.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
      .then(function(modal) {
        vm.modal = modal;
      });

    vm.openModal = function() {
      vm.modal.show();
    };

    vm.closeModal = function() {
      vm.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      vm.modal.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

  }

}());