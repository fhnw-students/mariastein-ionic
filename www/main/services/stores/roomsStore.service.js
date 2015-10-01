/**
 * @name roomsStoreService
 * @module kmsscan.services.stores.Rooms
 * @author Gerhard Hirschfeld
 *
 * @description
 * This Service Class handel's the rooms data. It works with the local
 * database pouchDb to store and sync the data.
 *
 */
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

  RoomsStoreService.DBNAME = 'kmsscan.rooms';

  function RoomsStoreService(Logger, $q, helpersUtilsService, pouchDbUtilsService) {
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
    /**
     * @name get
     * @description
     * Returns the doc with the _id <uid>-<langKey>.
     *
     * @param uid Number
     * @param langKey String
     * @returns Object<page>
     */
    function get(uid, langKey) {
      return roomsDb.get(helpersUtilsService.buildDocId(uid, langKey))
        .then(function (page) {
          return page;
        });
    }

    /**
     * @name getAll
     * @description
     * Returns all docs with the given language.
     *
     * @param langKey String
     * @returns Array<page>
     */
    function getAll(langKey) {
      return roomsDb.allDocs({
        'include_docs': true
      })
        .then(_parseDocs)
        .then(function (results) {
          return helpersUtilsService.filterDocsWithSameLangKey(results, langKey);
        });
    }

    /**
     * @name sync
     * @description
     * This method is called by app.run.js for the synchronisation. It parses the images of
     * the pages and rooms. Afterwards it downloads the images from the typo3 backend.
     *
     * @param langKey String
     * @param idx Number
     * @param data Array<Object>
     * @returns deferred.promise|{then, always} rooms
     */
    function sync(rooms) {
      var deferred = $q.defer();
      //var rooms = data[idx].rooms;
      //var pages =  data[idx-1].objects; //data[idx - data.length / 2].objects;
      //var counterObjectsInRooms = countObjectsInRooms(pages);
      //rooms = addCounter(rooms, counterObjectsInRooms);
      log.debug('sync', rooms);
      _activate()
        .then(function () {
          return _sync(rooms);
        })
        .then(deferred.resolve)
        .catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * @name addCounter
     * @description
     * This method adds the amount property to the rooms doc.
     *
     * @param rooms Array<Object>
     * @param counterObjectsInRooms
     * @returns Array<Object>
     */
    function addCounter(rooms, counterObjectsInRooms) {
      return rooms.map(function (room) {
        room.amount = counterObjectsInRooms[room.uid] || 0;
        return room;
      });
    }

    /**
     * @name countObjectsInRooms
     * @description
     * It counts the amount of Object in a single room.
     *
     * @param pages Array<pages>
     * @returns Object with the counter results
     */
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

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    function _sync(data) {
      var queue = [];
      for (var i = 0; i < data.length; i++) {
        queue.push(_syncRoom(data[i]));
      }
      return $q.all(queue);
    }

    function _syncRoom(record) {
      var deferred = $q.defer();
      var id = helpersUtilsService.buildDocId(record.uid, record.langKey);
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