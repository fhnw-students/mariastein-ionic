(function () {
    'use strict';

    angular.module('kmsscan.views.Init', [
      //'kmsscan.services.History',
      //'kmsscan.services.News'

      'kmsscan.services.rest.Typo3',
      'kmsscan.services.sql.Objects',
      'kmsscan.services.sql.Rooms',
      'kmsscan.services.sql.Images'
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


    function InitController($q, $ionicPlatform, typo3Service, objectsSqlService, roomsSqlService, imagesSqlService) {
      var vm = this; // view-model
      vm.typo3Data = {};
      console.info('[InitController]');
      $ionicPlatform.ready(function () {
        console.info('[$ionicPlatform] ready');
        typo3Service.load()
          .then(function (typo3Data) {
            vm.typo3Data = typo3Data;
            console.info('[typo3Data] ', typo3Data);
            return $q.all([
              dataService.sync(typo3Data.data)
            ]);
          })
          .then(function (results) {
            return dataService.getAll();
          })
          .then(function (results) {
            console.info('[after-all] ', results);
          })
          .catch(function (err) {
            // TODO
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
      });

      //$q.all([
      //  dataService.loadCsv(),
      //  historyService.init(),
      //  newsService.init(),
      //  typo3Service.get()
      //])
      //  .then(function (results) {
      //    $timeout(function () {
      //      $ionicHistory.nextViewOptions({
      //        disableAnimate: false,
      //        disableBack:    true
      //      });
      //      $state.go('menu.welcome');
      //    }, 1000);
      //  });
      //
      //
      //
      //dataService.loadCsv()
      //  .then(function () {
      //    $timeout(function () {
      //      $ionicHistory.nextViewOptions({
      //        disableAnimate: false,
      //        disableBack:    true
      //      });
      //      $state.go('menu.welcome');
      //    }, 1000);
      //  });
    }


  }

  ()
)
;
