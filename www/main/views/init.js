(function () {
  'use strict';

  var namespace = 'kmsscan.views.Init';

  angular.module(namespace, [
    'kmsscan.utils.Logger'
  ])
    .config(StateConfig)
    .controller('InitCtrl', InitController);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('init', {
        url: '/init',
        templateUrl: 'main/views/init.html',
        controller: 'InitCtrl as init'
      });
  }

  function InitController($rootScope, $timeout, $state, Logger, $ionicPopup) {
    var vm = this; // view-model
    var log = new Logger(namespace);

    if (!$rootScope.syncIsActive) {
      $timeout(function () {
        $state.go('menu.welcome');
      }, 200);
    }

    $rootScope.$on('kmsscan.run.activate.succeed', function () {
      log.info('kmsscan.run.activate.succeed');
      $state.go('menu.welcome');
    });

    $rootScope.$on('kmsscan.run.activate.failed', function () {
      log.error('kmsscan.run.activate.failed');
      $state.go('menu.welcome');
      showOfflinePopup();
    });

    $rootScope.$on('kmsscan.run.offline', function () {
      showOfflinePopup();
    });

    //////////////////////////////////////////

    function showOfflinePopup() {
      $ionicPopup.show({
        title: 'Beim Laden der Daten ist ein Fehler aufgetreten',
        buttons: [{
          text: 'Neu laden',
          onTap: function () {
            document.location = '.'; // reload the current page
          }
        },
          {
            text: 'Abbrechen'
          }]
      });
    }

  }

}());