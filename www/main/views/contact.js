/**
 * @module kmsscan.views.Contact
 * @author Piotr Halicki
 *
 * @description
 * This view shows the contact information about the monastery mariastein
 *
 */
(function () {
  'use strict';

  angular.module('kmsscan.views.Contact', [])
    .config(StateConfig);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.contact', {
        url: '/contact',
        views: {
          'menuContent': {
            templateUrl: 'main/views/contact.html'
          }
        }
      });
  }


}());
