(function () {
  'use strict';

  angular
    .module('kmsscan.services.Typo3', [])
    .factory('typo3Service', Typo3Service);

  function Typo3Service($q, $http) {
    console.info('[Typo3Service]');
    var service = {
      load: load
    };

    return service;

    ////////////////

    function load() {
      //http://kloster-mariastein.business-design.ch/index.php?id=136&type=5000
      console.info('[Typo3Service] -> load()');
      var deferred = $q.defer();
      $http({
        url: 'http://localhost:3000/data',
        type: 'GET',
        dataType: 'json'
      })
        .success(function (response) {
          console.info('[Typo3Service] -> then()', response);
          var data = _parseData(response);

          deferred.resolve({
            data: data,
            rooms: _parseRooms(data),
            media: _parseMedia(data)
          });
        })
        .error(function (err) {
          console.error('[Typo3Service] -> error()', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function _parseRooms(data) {
      var rooms = data.map(function (item) {
        return item.room;
      });
      return _.uniq(rooms, function (item) {
        return item.uid;
      });
    }

    function _parseMedia(data) {
      var media = [];
      for (var i = 0; i < data.length; i++) {
        for (var n = 0; n < data[i].image.length; n++) {
          if(data[i].image[n]){
            media.push(data[i].image[n]);
          }
        }
      }
      return _.uniq(media, function (item) {
        return item.uid;
      });
    }

    function _parseData(data) {
      data = data.map(function(item){
        var newItem = _getObject(item.content);
        newItem.image = _parseImage(newItem.image);
        return newItem;
      });
      console.info('[Typo3Service] -> _parseData()', data);
      return data;
    }

    function _getObject(obj){
      for(var key in obj){
        if(angular.isObject(obj)){
          return obj[key];
        }
      }
      return {};
    }

    function _parseImage(images){
      var a = [];
      for(var key in images){
        a.push(images[key]);
      }
      return a;
    }

  }
})();