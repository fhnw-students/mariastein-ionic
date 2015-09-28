(function () {
  'use strict';

  var namespace = 'kmsscan.services.stores.Rooms';

  angular
    .module(namespace, [
      'pouchdb',
      'kmsscan.utils.Logger',
      'kmsscan.utils.Helpers',
      'kmsscan.utils.PouchDb'
    ])
    .factory('roomsStoreService', RoomsStoreService);

  /**
   * Service Class
   * @param $q
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */

  RoomsStoreService.DBNAME = 'kmsscan.rooms';

  function RoomsStoreService(Logger, $q, pouchDB, helpersUtilsService, pouchDbUtilsService) {
    var log = new Logger(namespace);
    var roomsDb;
    log.info('init');

    // Public API
    var service = {
      get: get,
      getAll: getAll,

      sync: sync,
      clean: _clean,
      addCounter: addCounter,
      countObjectsInRooms: countObjectsInRooms
    };

    _activate();
    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function get(uid, langkey) {
      return roomsDb.get(helpersUtilsService.buildDocId(uid, langkey))
        .then(function (page) {
          return page;
        });
    }

    function getAll(langkey) {
      return roomsDb.allDocs({
        'include_docs': true
      })
        .then(_parseDocs)
        .then(function (results) {
          return helpersUtilsService.filterDocsWithSameLangKey(results, langkey);
        });
    }

    function sync(langkey, idx, data) {
      var deferred = $q.defer();
      var rooms = data[idx].rooms;
      var pages = data[idx - data.length / 2].objects;
      var counterObjectsInRooms = countObjectsInRooms(pages);
      rooms = addCounter(rooms, counterObjectsInRooms);

      log.debug('sync', rooms);
      _activate()
        .then(function () {
          return _sync(langkey, rooms);
        })
        .then(function () {
          log.debug('success');
          deferred.resolve(rooms);
        })
        .catch(function (err) {
          log.error('failed', err);
          deferred.reject(err);
        });

      return deferred.promise;
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    function _sync(langkey, data) {
      var queue = [];
      for (var i = 0; i < data.length; i++) {
        queue.push(_syncRoom(langkey, data[i]));
      }
      return $q.all(queue);
    }

    function _syncRoom(langkey, record) {
      var deferred = $q.defer();

      record.langkey = helpersUtilsService.getLanguageKeyByValue(langkey);
      var id = helpersUtilsService.buildDocId(record.uid, record.langkey);

      roomsDb.put(record, id)
        .then(function (response) {
          log.debug('add() -> success', response);
          deferred.resolve(response);
        })
        .catch(function (err) {
          log.error('add() -> failed', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function _parseDocs(response) {
      var array = response.rows;
      for (var i = 0; i < array.length; i++) {
        array[i] = _parseDoc(array[i]);
      }
      return array;
    }

    function _parseDoc(item) {
      return item.doc;
    }

    function addCounter(rooms, counterObjectsInRooms) {
      return rooms.map(function (room) {
        room.amount = counterObjectsInRooms[room.uid] || 0;
        return room;
      });
    }

    function countObjectsInRooms(pages) {
      var counter = {};
      pages.map(function (page) {
        if (page.room && page.room.uid) {
          return page.room.uid;
        }
        return page.room;
      })
        .filter(function (roomId) {
          return roomId !== undefined;
        })
        .map(function (roomId) {
          if (roomId in counter) {
            counter[roomId]++;
          } else {
            counter[roomId] = 1;
          }
        });
      return counter;
    }

    function _activate() {
      roomsDb = pouchDbUtilsService.createDb(RoomsStoreService.DBNAME);
      var deferred = $q.defer();
      deferred.resolve(roomsDb);
      return deferred.promise;
    }

    function _clean() {
      return pouchDbUtilsService.destroyDb(roomsDb);
    }

  }
})();