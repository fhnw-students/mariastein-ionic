/**
 * @name parsersUtilsService
 * @module kmsscan.utils.Parsers
 * @author Gerhard Hirschfeld
 *
 * @description
 * This Service Class has some useful helper function, which are
 * used in several other services or controllers
 *
 */
(function () {
  'use strict';

  angular
    .module('kmsscan.utils.Parsers', [
      'kmsscan.utils.Helpers'
    ])
    .factory('parsersUtilsService', ParsersUtilsService);

  function ParsersUtilsService(helpersUtilsService) {

    return {
      parsePagesFromTypo3Response: parsePagesFromTypo3Response,
      parseRoomsFromTypo3Response: parseRoomsFromTypo3Response,
      parseImagesFromTypo3Response: parseImagesFromTypo3Response
    };

    ////////////////////////////////////////////////////////
    /**
     * @name parsePagesFromTypo3Response
     * @param responses Array
     * @returns Array
     */
    function parsePagesFromTypo3Response(responses) {
      var pages = responses
        .filter(_filterPageResponses)
        .map(_parseImages)
        .map(_parseRooms)
        .map(_setLanguageKey)
        .map(_parseTexts);
      return pages
    }

    /**
     * @name parseRoomsFromTypo3Response
     * @param responses Array
     * @returns Array
     */
    function parseRoomsFromTypo3Response(responses) {
      var pages = responses[0];
      var rooms = responses
        .filter(_filterRoomsResponses)
        .map(function (rooms) {
          return rooms.map(function (room) {
            room.previewImageUid = _getImageByTitle(room.image, 'preview');
            room.mapImageUid = _getImageByTitle(room.image, 'map');
            room.amount = pages.filter(function (page) {
              return page.room === room.uid;
            }).length;
            delete room.image;
            return room;
          });
        })
        .map(_setLanguageKey)
        .map(_parseTexts);
      return rooms
    }

    /**
     * @name parseImagesFromTypo3Response
     * @param responses Array
     * @returns Object Images
     */
    function parseImagesFromTypo3Response(responses) {
      var data = responses
        .filter(function (item) {
          return _.isArray(item);
        })
        .map(function (r) {
          return r.map(function (c) {
            return c.image;
          })
        });
      var images = {};
      for (var pr = 0; pr < data.length; pr++) {
        for (var c = 0; c < data[pr].length; c++) {
          for (var i = 0; i < data[pr][c].length; i++) {
            if (data[pr][c][i]) {
              images[data[pr][c][i].uid] = data[pr][c][i].originalResource.publicUrl;
            }
          }
        }
      }
      return images;
    }


    // PRIVATE /////////////////////////////////////////////
    function _setLanguageKey(a, idx) {
      return a.map(function (item) {
        item.langKey = helpersUtilsService.getLanguageKeyByValue(idx);
        return item;
      });
    }

    function _parseRooms(responses) {
      return responses.map(function (response) {
        if (response.room) {
          response.room = (response.room.uid) ? response.room.uid : response.room;
        }
        return response;
      });
    }

    function _parseImages(responses) {
      return responses.map(function (response) {
        response.image = response.image.map(function (image) {
          return image.uid;
        });
        return response;
      });
    }

    function _filterPageResponses(r, idx) {
      return idx % 2 === 0;
    }

    function _filterRoomsResponses(r, idx) {
      return idx % 2 !== 0;
    }

    function _getImageByTitle(images, title) {
      images = images.filter(function (image) {
        return image.originalResource.title === title;
      });
      var image = (images.length > 0) ? images[0] : undefined;
      return (image) ? image.uid : image;
    }

  }

  function _parseTexts(p) {
    return p.map(function(page){
      if(page.teaser && _.isString(page.teaser)){
        page.teaser = _parseText(page.teaser);
      }
      if(page.content && _.isString(page.content)){
        page.content = _parseText(page.content);
      }
      return page;
    });
  }

  function _parseText(text) {
    return text
      .split('')
      .map(function (char) {
        if(char.charCodeAt(0) === 10){
          return '<br/>';
        }
        return char;
      })
      .join('');
  }

  //function parseImages(results) {
  //  results = results
  //    .filter(function (item) {
  //      return _.isArray(item);
  //    });
  //  var images = {};
  //  for (var l = 0; l < results.length; l++) {
  //    for (var c = 0; c < results[l].length; c++) {
  //      images[results[l][c].uid] = results[l][c].originalResource.publicUrl;
  //    }
  //  }
  //  return images;
  //}

}());
