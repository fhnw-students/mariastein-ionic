/**
 * @module kmsscan.views.NotFound
 * @author Gerhard Hirschfeld
 *
 * @description
 * This view shows a static view for not found objects
 *
 */
(function () {
  'use strict';

  angular.module('kmsscan.views.NotFound', [])
    .config(StateConfig);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.notFound', {
        url: '/not-found',
        views: {
          'menuContent': {
            templateUrl: 'main/views/notFound.html'
          }
        }
      });
  }




}());
