(function () {
  'use strict';

  angular
    .module('kmsscan.services.stores.Pages', [
      'pouchdb',
      'kmsscan.utils.Logger'
    ])
    .factory('pagesStoreService', PagesStoreService);

  PagesStoreService.DBNAME = 'kmsscan.pages';
  PagesStoreService.WELCOME_PAGE_UID = 3;

  PagesStoreService.LANGUAGES = {
    DE: 0,
    0: 'DE',
    FR: 1,
    1: 'FR',
    EN: 2,
    2: 'EN',
    IT: 3,
    3: 'IT'
  };

  /**
   * Service Class
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function PagesStoreService($q, Logger, pouchDB) {
    var log = new Logger('kmsscan.services.stores.Pages');
    var pagesDb;
    log.info('init');


    // Public API
    var service = {
      get: get,
      visited: visited,
      getWelcomePage: getWelcomePage,

      sync: sync
    };

    _activate();
    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function get(uid, langKey) {
      return pagesDb.get(_id(uid, langKey))
        .then(function (page) {
          page.image = JSON.parse(page.image);
          return page;
        });
    }

    function visited(uid) {

    }

    function getWelcomePage(langKey) {
      return get(PagesStoreService.WELCOME_PAGE_UID, langKey);
    }

    /**
     *
     * @returns {deferred.promise|{then, always}}
     */
    function sync(langKey, data) {
      var deferred = $q.defer();
      log.info('sync', data);
      _activate()
        .then(function () {
          return _sync(langKey, data);
        })
        .then(function () {
          log.info('success');
          deferred.resolve(data);
        })
        .catch(function (err) {
          log.error('failed', err);
          deferred.reject(err);
        });

      return deferred.promise;
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    function _id(uid, langkey) {
      return uid.toString() + '-' + langkey;
    }

    function _sync(langKey, data) {
      var queue = [];
      for (var i = 0; i < data.length; i++) {
        queue.push(_syncPage(langKey, data[i]));
      }
      return $q.all(queue);
    }

    function _syncPage(langKey, record) {
      var deferred = $q.defer();
      var id = _id(record.uid, PagesStoreService.LANGUAGES[langKey]);

      pagesDb.get(id).then(function (doc) {
        log.info('get()', doc);
        return pagesDb.put(_parsePage(record, doc.visited), doc._id, doc._rev);
      }).then(function (response) {
        log.info('update() -> success', response);
        deferred.resolve(response);
      }).catch(function (err) {
        if (err.status === 404) {
          pagesDb.put(_parsePage(record), id)
            .then(function (response) {
              log.info('add() -> success', response);
              deferred.resolve(response);
            })
            .catch(function (err) {
              log.error('add() -> failed', err);
              deferred.reject(err);
            });
        } else {
          log.error('catch() -> failed', err);
          deferred.reject(err);
        }
      });
      return deferred.promise;
    }


    function _parsePage(data, visited) {
      data = angular.copy(data);
      data.visited = visited || false;
      data.room = data.room && data.room.uid;

      if(data.image){
        data.image = data.image.map(function (image) {
          return image.uid;
        });
        data.image = JSON.stringify(data.image);
      }

      return data;
    }

    function _activate() {
      var deferred = $q.defer();
      pagesDb = pouchDB(PagesStoreService.DBNAME, {
        adapter: 'websql'
      });
      //pagesDb.info().then(console.log.bind(console));
      deferred.resolve();
      return deferred.promise;
    }

    function _destroy() {
      return pagesDb.destroy();
    }

  }
})();