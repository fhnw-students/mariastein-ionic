(function() {
  'use strict';

  angular.module('kmsscan.views.Tutorial', [
      'kmsscan.utils.Logger',
      'kmsscan.services.stores.Settings'
    ])
    .config(StateConfig)
    .controller('TutorialCtrl', TutorialController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.tutorial', {
        url: '/tutorial',
        views: {
          'menuContent': {
            templateUrl: 'main/views/tutorial.html',
            controller: 'TutorialCtrl as tutorial'
          }
        }
      });
  }



  function TutorialController($translate, $timeout, $rootScope, $state, settingsStoreService, Logger, $ionicSlideBoxDelegate) {
    var vm = this; // view-model
    var log = Logger('kmsscan.views.Tutorial');

    vm.settings = {};
    vm.more = false;
    vm.startSlide = 2;  //start at this slideindex to skip settings for 2nd+ start of tutorial
    vm.isReady = isReady;
    vm.onLanguageChange = onLanguageChange;
    vm.historyGoBack = historyGoBack;
    //$ionicSlideBoxDelegate.slide(vm.startSlide,0);

    activate();

    //////////////////////////////
    function activate() {
      log.debug('activate');
      $rootScope.$on('onLanguageChange', function(event, langKey) {
        vm.settings.language = angular.uppercase(langKey);
      });

      settingsStoreService.get()
        .then(function(settings) {
          log.debug('activate() - success', settings);
          vm.settings = settings;
          console.log("isPristine: "+vm.settings.isPristine);
          if(settings.isPristine){vm.startSlide=0;}
          $timeout(function(){
            $ionicSlideBoxDelegate.slide(vm.startSlide);
          });
        });
    }

    function saveSettings() {
      return settingsStoreService.set(vm.settings)
        .then(function(settings) {
          log.debug('saveSettings() - success', settings);
          vm.settings = settings;
          return settings;
        });
    }

    function onLanguageChange() {
      saveSettings(vm.settings)
        .then(function() {
          $rootScope.$broadcast('onLanguageChange', vm.settings.language);
        });
    }

    function historyGoBack() {
      if(vm.settings.isPristine){
        vm.settings.isPristine=!vm.settings.isPristine;
        saveSettings();
        }
      window.history.back();
    }

    vm.prevSlide = function() {
      $ionicSlideBoxDelegate.previous();
    }

    vm.nextSlide = function() {
      $ionicSlideBoxDelegate.next();
    }
    
    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }

    //returns current index of SlideBox
    vm.getSlideIndex= function() {
      return $ionicSlideBoxDelegate.currentIndex();
    }

    //returns biggest index of Slides in SlideBox
    vm.getSlideMaxIndex= function() {
      return $ionicSlideBoxDelegate.slidesCount()-1;
    }

    vm.showMore= function() {
      vm.more = true;
    };

    vm.showLess= function() {
      vm.more = false;
    };

  }


}());