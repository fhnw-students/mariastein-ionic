/**
 * @name ionicPlatform
 * @module kmsscan.ionicPlatform
 * @author Gerhard Hirschfeld
 *
 * @description
 * This configuration sets cordova settings
 */
(function () {
  'use strict';

  angular.module('kmsscan.ionicPlatform', [])
    .run(function ($ionicPlatform) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          window.StatusBar.styleLightContent();
        }
      });
    });

}());