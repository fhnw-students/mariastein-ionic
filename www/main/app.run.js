(function () {
  'use strict';

  angular.module('kmsscan.run', [
    'kmsscan.services.Data',
    'kmsscan.services.Typo3'
  ])
    .run(run);

  function run($log, $rootScope, $ionicPlatform, $cordovaSQLite, $translate) {
    // $rootScope.scan = barcodeScanner.scan;
    $rootScope.$on('onLanguageChange', function(event, langKey){
      $translate.use(langKey);
    });

    $ionicPlatform.ready(function(){
      db = $cordovaSQLite.openDB("my.db");
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS data_main (id INTEGER PRIMARY KEY, title TEXT, teaser TEXT, content TEXT, qrcode TEXT)');
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS data_img (id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER, file BLOB)');
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS data_room (id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER, name TEXT, qrcode TEXT)');
    });
  }

}());