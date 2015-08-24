(function () {
  'use strict';

  angular
    .module('kmsscan.services.Typo3', [])
    .factory('typo3Service', Typo3Service);

  function Typo3Service($http) {

    var data = [];
    //var fulfilled = false;

    var service = {
      //isFulfilled: isFulfilled,
      //loadCsv:     loadCsv,
      //has:         has,
      get:         get
    };

    return service;

    ////////////////

    function get(){
      $http.get('http://localhost:3000/data')
          .then(function(response) {
            console.log(response);
            data = response.data;
          }, function(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
    }

    

  }
})();