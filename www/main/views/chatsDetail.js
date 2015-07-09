(function () {
  'use strict';

  angular.module('kmsscan.views.chatsDetail', [
    'kmsscan.services.chats'
  ])
    .config(StateConfig)
    .controller('ChatDetailCtrl', ChatsDetailController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('chat-detail', {
        url:         '/chats/:chatId',
        templateUrl: 'main/views/chat-detail.html',
        controller:  'ChatDetailCtrl'
      });
  }


  function ChatsDetailController($scope, Chats, $stateParams) {
    $scope.chat = Chats.get($stateParams.chatId);
  }


}());
