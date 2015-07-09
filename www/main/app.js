// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'kmsscan' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'kmsscan.services' is found in services.js
// 'kmsscan.controllers' is found in controllers.js
angular.module('kmsscan', [
  'ionic',

  'kmsscan.ionicPlatform',
  'kmsscan.routerConfig',
  'kmsscan.views'

  //'kmsscan.controllers',
  //'kmsscan.services'
]);


//
//.config(function($stateProvider) {
//
//  // Ionic uses AngularUI Router which uses the concept of states
//  // Learn more here: https://github.com/angular-ui/ui-router
//  // Set up the various states which the app can be in.
//  // Each state's controller can be found in controllers.js
//  $stateProvider
//
//    .state('chat-detail', {
//      url: '/chats/:chatId',
//          templateUrl: 'templates/chat-detail.html',
//          controller: 'ChatDetailCtrl'
//    });
//
//
//
//});
