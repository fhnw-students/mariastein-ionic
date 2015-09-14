(function() {
  'use strict';

  angular.module('kmsscan.views.Init', [
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

  function InitController($rootScope, $timeout, $state, Logger, $ionicPopup, $translate) {
    var vm = this; // view-model
    var log = new Logger('kmsscan.views.Init');

    if (!$rootScope.syncIsActive) {
      $timeout(function() {
        $state.go('menu.welcome');
      }, 200);
    }

    $rootScope.$on('kmsscan.run.activate.succeed', function() {
      log.info('kmsscan.run.activate.succeed');
      $state.go('menu.welcome');
    });

    $rootScope.$on('kmsscan.run.activate.failed', function() {
      log.error('kmsscan.run.activate.failed');
      $state.go('menu.welcome');
      showOfflinePopup();
    });

    $rootScope.$on('kmsscan.run.offline', function() {
      showOfflinePopup();
    });

    //////////////////////////////////////////

    function showOfflinePopup() {
      $ionicPopup.show({
         title: 'Beim Laden der Daten ist ein Fehler aufgetreten',
         buttons:
            [{
                text:"Neu laden",
                onTap: function(e) {
                    document.location = "."; // reload the current page
                }
             },
             {
                text:"Abbrechen"
            }]
      });
    };

  }

}());