/**
 * @module kmsscan.views.Tutorial
 * @author Roman Dyck
 *
 * @description
 * This Class handel's the Tutorial behaviour.
 *
 */
 (function () {
  'use strict';

  var namespace = 'kmsscan.views.Tutorial';

  angular.module(namespace, [
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

  function TutorialController($window, $timeout, $rootScope, settingsStoreService, Logger, $ionicSlideBoxDelegate) {
    var vm = this; // view-model
    var log = new Logger(namespace);

    vm.settings = {};
    vm.more = false;  //variable for more/less-text function
    vm.startSlide = 2; //start at this slideindex to skip settings for 2nd+ start of tutorial
    vm.hgt = $window.innerHeight - 200; //window height for ion-scroll

    vm.isReady = isReady;
    vm.onLanguageChange = onLanguageChange;
    vm.historyGoBack = historyGoBack;
    vm.prevSlide = prevSlide;
    vm.nextSlide = nextSlide;
    vm.getSlideIndex = getSlideIndex;
    vm.getSlideMaxIndex = getSlideMaxIndex;
    vm.showMore = showMore;
    vm.showLess = showLess;

    activate();
    //////////////////////////////
    function activate() {
      log.debug('activate');
      $rootScope.$on('onLanguageChange', function (event, langKey) {
        vm.settings.language = angular.uppercase(langKey);
      });

      settingsStoreService.get()
        .then(function (settings) {
          log.debug('activate() - success', settings);
          vm.settings = settings;
          console.log('isPristine: ' + vm.settings.isPristine);
          if (vm.settings.isPristine) {
            vm.startSlide = 0;
          }
          $timeout(function () {
            $ionicSlideBoxDelegate.slide(vm.startSlide);
          });

          settings.isPristine = false;
          settingsStoreService.set(settings);
        });
    }

    function saveSettings() {
      return settingsStoreService.set(vm.settings)
        .then(function (settings) {
          log.debug('saveSettings() - success', settings);
          vm.settings = settings;
          return settings;
        });
    }

    function onLanguageChange() {
      saveSettings(vm.settings)
        .then(function () {
          $rootScope.$broadcast('onLanguageChange', vm.settings.language);
        });
    }

    //leave tutorial
    function historyGoBack() {
      if (vm.settings.isPristine) {
        vm.settings.isPristine = !vm.settings.isPristine;
        saveSettings();
      }
      window.history.back();
    }

    function prevSlide() {
      $ionicSlideBoxDelegate.previous();
    }

    function nextSlide() {
      $ionicSlideBoxDelegate.next();
    }

    //returns current index of SlideBox
    function getSlideIndex() {
      return $ionicSlideBoxDelegate.currentIndex();
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }

    //returns biggest index of Slides in SlideBox
    function getSlideMaxIndex() {
      return $ionicSlideBoxDelegate.slidesCount() - 1;
    }

    //show more text
    function showMore() {
      vm.more = true;
    }

    //show less text
    function showLess() {
      vm.more = false;
    }

  }

}());