(function () {
  'use strict';

  angular.module('kmsscan.views.chats', [
    'kmsscan.services.chats'
  ])
    .config(StateConfig)
    .controller('ChatsCtrl', ChatsController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('chats', {
        url:         '/chats',
        templateUrl: 'main/views/chats.html',
        controller:  'ChatsCtrl'
      });
  }


  function ChatsController($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  }


}());
