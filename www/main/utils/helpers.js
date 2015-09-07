(function () {
  'use strict';

  angular
    .module('kmsscan.utils.Helpers', [])
    .service('helpersUtilsService', HelpersUtilsService);

  function HelpersUtilsService() {

    this.hasUid = function (list, uid) {
      list = list || [];
      for (var i = 0; i < list.length; i++) {
        if (parseInt(uid, 10) === parseInt(list[i].uid, 10)) {
          return true;
        }
      }
      return false;
    };

    this.getByUid = function (list, uid) {
      list = list || [];
      for (var i = 0; i < list.length; i++) {
        if (parseInt(uid, 10) === parseInt(list[i].uid, 10)) {
          return list[i];
        }
      }
      return undefined;
    };

  }

}());
