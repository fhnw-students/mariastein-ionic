(function() {
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
    log.debug('init');

    // Public API
    var service = {
      get: get,
      visited: visited,
      getWelcomePage: getWelcomePage,
      getVisited: getVisited,

      sync: sync,
      destroy: _destroy
    };

    _activate();
    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function get(uid, langKey) {
      return pagesDb.get(_id(uid, langKey))
        .then(function(page) {
          page.image = JSON.parse(page.image);
          return page;
        });
    }

    function getVisited(uid, langKey) {
      return pagesDb.get(_id(uid, langKey))
        .then(function(page) {
          page.image = JSON.parse(page.image);
          return page;
        });
    }

    function visited(qrcode) {
      var deferred = $q.defer();
      log.debug('visited()', qrcode);
      //PageQRCode1
      pagesDb.find({
          selector: {
            qrcode: {
              $eq: qrcode
            }
          }
        })
        .then(_visited)
        .then(function(r) {
          return pagesDb.get(r[0].id);
        })
        .then(function(doc) {
          log.debug('query() - success', doc);
          deferred.resolve(doc.uid);
        })
        .catch(function(err) {
          log.error('query() - failed', err);
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function getWelcomePage(langKey) {
      return get(PagesStoreService.WELCOME_PAGE_UID, langKey);
    }

    function sync(langKey, data) {
      var deferred = $q.defer();
      log.debug('sync', data);
      _activate()
        .then(function() {
          return _sync(langKey, data);
        })
        .then(_createIndex)
        .then(function() {
          log.debug('success');
          deferred.resolve(data);
        })
        .catch(function(err) {
          log.error('failed', err);
          deferred.reject(err);
        });

      return deferred.promise;
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    function _visited(docs) {
      
      // var queue = [];
      for (var i = docs.length - 1; i >= 0; i--) {
        docs[i].visited = true;
        // queue.push(
        //   pagesDb.put(docs[i], docs[i]._id, docs[i]._rev)
        // );
      };
      // return $q.all(queue);
      log.debug('_visited(docs)', docs);
      return pagesDb.bulkDocs(docs);
    }

    function _createIndex() {
      return pagesDb.createIndex({
        index: {
          fields: ['qrcode', 'visited', 'langkey']
        }
      });
    }

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
      record.langkey = PagesStoreService.LANGUAGES[langKey];
      pagesDb.get(id).then(function(doc) {
        log.debug('get()', doc);
        return pagesDb.put(_parsePage(record, doc.visited), doc._id, doc._rev);
      }).then(function(response) {
        log.debug('update() -> success', response);
        deferred.resolve(response);
      }).catch(function(err) {
        log.debug('catch() -> failed', err);
        if (err.status === 404) {
          pagesDb.put(_parsePage(record), id)
            .then(function(response) {
              log.debug('add() -> success', response);
              deferred.resolve(response);
            })
            .catch(function(err) {
              log.error('add() -> failed', err);
              deferred.reject(err);
            });
        } else {
          log.error('reject() -> failed', err);
          deferred.reject(err);
        }
      });
      return deferred.promise;
    }

    function _parsePage(data, visited) {
      data = angular.copy(data);
      data.visited = visited || false;
      data.room = data.room && data.room.uid;

      if (data.image) {
        data.image = data.image.map(function(image) {
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