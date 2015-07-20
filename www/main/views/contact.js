(function () {
  'use strict';

  angular.module('kmsscan.views.Contact', [])
    .config(StateConfig)
    .controller('ContactCtrl', ContactController);


  function StateConfig($stateProvider) {
    $stateProvider
        .state('menu.contact', {
          url:   '/contact',
          views: {
            'menuContent': {
              templateUrl: 'main/views/contact.html',
              controller:  'ContactCtrl as contact'
            }
          }
        });
  }


  function ContactController() {
    var vm = this; // view-model

    // Code goes here

  }


}());
