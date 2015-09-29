/**
 * @module kmsscan.views.Menu
 * @author Gianni Alagna
 *
 * @description
 * This view shows the abstract view with the menu
 *
 */
(function () {
  'use strict';

  var namespace = 'kmsscan.views.Menu';

  angular.module(namespace, [])
    .config(StateConfig);

  function StateConfig($stateProvider) {
    $stateProvider.state('menu', {
      url: '/menu',
      abstract: true,
      templateUrl: 'main/views/menu.html'
    });
  }

}());