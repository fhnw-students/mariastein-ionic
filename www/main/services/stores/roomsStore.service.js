(function() {
  'use strict';

  angular
    .module('kmsscan.services.stores.Rooms', [
      'pouchdb',
      'kmsscan.utils.Logger'
    ])
    .factory('roomsStoreService', RoomsStoreService);

  /**
   * Service Class
   * @param $q
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */

  RoomsStoreService.DBNAME = 'kmsscan.rooms';

  RoomsStoreService.LANGUAGES = {
    DE: 0,
    0: 'DE',
    FR: 1,
    1: 'FR',
    EN: 2,
    2: 'EN',
    IT: 3,
    3: 'IT'
  };

  function RoomsStoreService(Logger, $q, pouchDB) {
    var log = new Logger('kmsscan.services.stores.Rooms');
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
      return roomsDb.get(_id(uid, langkey))
        .then(function(page) {
          return page;
        });
    }

    function getAll(langkey) {
      return roomsDb.allDocs({
          include_docs: true
        })
        .then(_parseDocs)
        .then(function(results) {
          return _filterDocsWithSameLangKey(results, langkey);
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
        .then(function() {
          return _sync(langkey, rooms);
        })
        .then(function() {
          log.debug('success');
          deferred.resolve(rooms);
        })
        .catch(function(err) {
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
      var id = _id(record.uid, RoomsStoreService.LANGUAGES[langkey]);
      record.langkey = RoomsStoreService.LANGUAGES[langkey];

      roomsDb.put(record, id)
        .then(function(response) {
          log.debug('add() -> success', response);
          deferred.resolve(response);
        })
        .catch(function(err) {
          log.error('add() -> failed', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function _filterDocsWithSameLangKey(array, langkey) {
      return array.filter(function(doc) {
        return langkey === doc.langkey;
      });
    }

    function _parseDocs(response) {
      var array = response.rows;
      for (var i = 0; i < array.length; i++) {
        array[i] = _parseDoc(array[i]);
      };
      return array;
    }

    function _parseDoc(item) {
      return item.doc;
    }

    function addCounter(rooms, counterObjectsInRooms){
      return rooms.map(function  (room) {
        room.amount = counterObjectsInRooms[room.uid] || 0;
        return room;
      });
    }

    function countObjectsInRooms(pages) {
      var countObjectsInRooms = {};
      pages.map(function(page) {
          if (page.room && page.room.uid) {
            return page.room.uid;
          }
          return page.room;
        })
        .filter(function(roomId) {
          return roomId !== undefined;
        })
        .map(function(roomId) {
          if (roomId in countObjectsInRooms) {
            countObjectsInRooms[roomId]++;
          } else {
            countObjectsInRooms[roomId] = 1;
          }
        });
      return countObjectsInRooms;
    }

    function _id(uid, langkey) {
      return uid.toString() + '-' + langkey;
    }

    function _activate() {
      var deferred = $q.defer();
      roomsDb = pouchDB(RoomsStoreService.DBNAME, {
        adapter: 'websql'
      });
      deferred.resolve();
      return deferred.promise;
    }

    function _clean() {
      return roomsDb.destroy();
    }

  }
})();