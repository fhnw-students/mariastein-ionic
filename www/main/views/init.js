(function () {
  'use strict';

  angular.module('kmsscan.views.Init', [
    'kmsscan.utils.Logger',

    'kmsscan.services.rest.Typo3',
    'kmsscan.services.sql.Objects',
    'kmsscan.services.sql.Rooms',
    'kmsscan.services.sql.Images',
    'kmsscan.services.sql.History'
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

  function InitController($q, $ionicPlatform, Logger, typo3Service, objectsSqlService, roomsSqlService, imagesSqlService, historySqlService) {
    var vm = this; // view-model
    var log = new Logger('kmsscan.views.Init');
    vm.typo3Data = {};
    log.info('start');

    $ionicPlatform.ready(function () {
      if (window.cordova) {
        log.info('$ionicPlatform is ready');
        typo3Service.load()
          .then(function (typo3Data) {
            vm.typo3Data = typo3Data;
            log.info('typo3Data', typo3Data);
            return $q.all([
              historySqlService.sync(),
              objectsSqlService.sync(typo3Data.objects),
              roomsSqlService.sync(typo3Data.rooms),
              imagesSqlService.sync(typo3Data.images)
            ]);
          })
          .then(function (results) {
            imageTest();
            log.info('done', results);
          })
          .catch(function (err) {
            log.error('stop -> catch', err);
            // TODO
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
      } else {
        log.warn('stop ->', 'Cordova Plugins are unreachable');
      }
    });
    //imageTest();

    function imageTest() {
      var smallImage = document.getElementById('test');

      //typo3Service.getImageBlob('files/a.jpeg')
      //  .then(function (blob) {
      //    var urlCreator = window.URL || window.webkitURL;
      //    var imageUrl = urlCreator.createObjectURL(blob);
      //    smallImage.src = imageUrl;
      //  })
      //  .catch(function (err) {
      //    console.error(err);
      //  });


      imagesSqlService.get(42)
        .then(function (result) {

          var arrayBufferView = new Uint8Array(result);
          var blob = new Blob([arrayBufferView], {type: "image/jpeg"});
          var urlCreator = window.URL || window.webkitURL;
          var imageUrl = urlCreator.createObjectURL(blob);
          smallImage.src = imageUrl;
          //smallImage.src = "data:image/jpeg;base64," + Base64.encode(result.data);

          log.info('imageTest.done', result);
        })
        .catch(function (err) {
          log.error('imageTest.catch', err);
        });
    }

    //$q.all([
    //  dataService.loadCsv(),
    //  historyService.init(),
    //  newsService.init(),
    //  typo3Service.get(),
    //  mapService.init(),
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

}());