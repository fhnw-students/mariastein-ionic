(function () {
  'use strict';

  angular.module('kmsscan.run', [
    'kmsscan.services.Data',
    'kmsscan.services.Typo3'
  ])
    .run(run);

  function run($log, $rootScope, $ionicPlatform, $cordovaSQLite) {
    // $rootScope.scan = barcodeScanner.scan;
    $ionicPlatform.ready(function(){
      db = $cordovaSQLite.openDB("test.db");
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS data_main (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, teaser TEXT, content TEXT, qrcode TEXT, file BLOB, room TEXT)');
      //$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS data_test (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)');
    });
  }

}());