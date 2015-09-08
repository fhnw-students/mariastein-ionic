(function () {
  'use strict';

  angular
    .module('kmsscan.services.Typo3', [])
    .factory('typo3Service', Typo3Service);

  function Typo3Service($http, $cordovaSQLite, $q, $ionicPlatform) {

    var data = [];

    var service = {
      get:         get,
      getAll:      getAll,
      query:       query
    };

    return service;

    ////////////////

    function get(){
      $http.get('http://kloster-mariastein.business-design.ch/index.php?id=136&type=5000')
          .then(function(response) {
            data = response.data;
            initDB();
          }, function(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
    }

    function getObject(obj){
      for(var key in obj){
        if(angular.isObject(obj)){
          return obj[key];
        }
      }
      return {};
    }

    function initDB(){
      var img_blob;
      var parameters;
      data = data.map(function(item){
        var newItem = getObject(item.content);
        newItem.image = parseImage(newItem.image);
        return newItem;
      });

      console.info(data);
      for (var i = 0; i<data.length; i++){
        for (var j = 0; j<data[i].image.length; j++){
          img_blob = getBlob(data[i].image[j].originalResource.publicUrl);
          query("INSERT INTO data_img (uid, file) VALUES (?,?)", [data[i].uid,img_blob]);
        }
        parameters = [data[i].uid,data[i].title,data[i].teaser,data[i].content,data[i].qrcode];
        query("INSERT INTO data_main (id,title,teaser,content,qrcode) VALUES (?,?,?,?,?)", parameters);
        query("INSERT INTO data_room (uid, name, qrcode) VALUES (?,?,?)",[data[i].uid,data[i].room.title,data[i].room.qrcode]);

      }

      function parseImage(images){
        var a = [];
        for(var key in images){
          a.push(images[key]);
        }
        return a;
      }
      getAll();
    }

    function getBlob(url){
      url = "http://kloster-mariastein.business-design.ch/"+url;
      // Simulate a call to Dropbox or other service that can
      // return an image as an ArrayBuffer.
      var xhr = new XMLHttpRequest();

      // Use JSFiddle logo as a sample image to avoid complicating
      // this example with cross-domain issues.
      xhr.open( "GET", url, true );

      // Ask for the result as an ArrayBuffer.
      xhr.responseType = "arraybuffer";

      xhr.onload = function( e ) {
        // Obtain a blob: URL for the image data.
        var arrayBufferView = new Uint8Array( this.response );
        var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
        return blob;
        //var urlCreator = window.URL || window.webkitURL;
        //var imageUrl = urlCreator.createObjectURL( blob );
        //var img = document.querySelector( "#photo" );
        //img.src = imageUrl;
      };

      xhr.send();
    }

    // Handle query's and potential errors
    function query(query, parameters) {
      parameters = parameters || [];
      var q = $q.defer();

      $ionicPlatform.ready(function () {
        $cordovaSQLite.execute(db, query, parameters)
            .then(function (result) {
              q.resolve(result);
            }, function (error) {
              alert('I found an error');
              alert(error);
              q.reject(error);
            });
      });
      return q.promise;
    }

    function getAll() {
      return query("SELECT * FROM data_main")
          .then(function(result){
            for (var i = 0; i < result.rows.length; i++) {
              alert(result.rows.item(i)['title']);
            }
          });
    }

  }
})();