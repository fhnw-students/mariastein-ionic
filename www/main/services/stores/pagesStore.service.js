(function() {
  'use strict';

  angular
    .module('kmsscan.services.stores.Pages', [
      'pouchdb',
      'kmsscan.utils.Logger'
    ])
    .factory('pagesStoreService', PagesStoreService);

  PagesStoreService.DBNAME = {
    PAGES: 'kmsscan.pages',
    HISTORY: 'kmsscan.history'
  };
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
    var pagesDb, historyDb;
    log.debug('init');

    // Public API
    var service = {
      get: get,
      getWelcomePage: getWelcomePage,

      visited: visited,
      getVisited: getVisited,

      sync: sync,
      clean: _cleanPages
    };

    _activate();
    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function getWelcomePage(langkey) {
      return get(PagesStoreService.WELCOME_PAGE_UID, langkey);
    }

    function get(uid, langkey) {
      return pagesDb.get(_id(uid, langkey))
        .then(function(page) {
          page.image = JSON.parse(page.image);
          return page;
        });
    }

    function getVisited(langkey) {
      return $q.all([
          pagesDb.allDocs({
            include_docs: true
          }),
          historyDb.allDocs({
            include_docs: true
          })
        ])
        .then(function(results) {
          results[0] = results[0].rows.map(function(item) {
            return item.doc;
          });
          results[1] = results[1].rows.map(function(item) {
            return item.doc;
          });
          return results;
        })
        .then(function(results) {
          var ids = results[1].map(function(doc) {
            return doc._id;
          });
          return results[0]
            .filter(function(doc) {
              return langkey === doc.langkey;
            })
            .filter(function(doc) {
              if (doc.uid) {
                return ids.indexOf(doc.uid.toString()) >= 0;
              }
              return false;
            })
            .map(function  (doc) {
              doc.image = JSON.parse(doc.image);
              return doc;
            });
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
        .then(function(uid) {
          log.debug('query() - success', uid);
          deferred.resolve(uid);
        })
        .catch(function(err) {
          log.error('query() - failed', err);
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function sync(langkey, data) {
      var deferred = $q.defer();
      log.debug('sync', data);
      _activate()
        .then(function() {
          return _sync(langkey, data);
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
    function _visited(response) {
      var docs = response.docs;
      var id = docs[0].uid.toString();
      var scanedAt = new Date();
      var deferred = $q.defer();
      log.debug('_visited', docs);
      if (_.isArray(docs) && docs.length > 0) {
        historyDb.get(id)
          .then(function(doc) {
            doc.scanedAt = scanedAt;
            return historyDb.put(doc);
          })
          .then(function() {
            deferred.resolve(id);
          })
          .catch(function(err) {
            if (err.status === 404) {
              historyDb.put({
                  scanedAt: scanedAt
                }, id)
                .then(function(response) {
                  log.debug('add() -> success', response);
                  deferred.resolve(id);
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
      } else {
        deferred.reject({
          status: 404,
          data: docs
        });
      }
      return deferred.promise;
    }

    function _createIndex() {
      return pagesDb.createIndex({
        index: {
          fields: ['qrcode', 'langkey']
        }
      });
    }

    function _id(uid, langkey) {
      return uid.toString() + '-' + langkey;
    }

    function _sync(langkey, data) {
      var queue = [];
      for (var i = 0; i < data.length; i++) {
        queue.push(_syncPage(langkey, data[i]));
      }
      return $q.all(queue);
    }

    function _syncPage(langkey, record) {
      var deferred = $q.defer();
      var id = _id(record.uid, PagesStoreService.LANGUAGES[langkey]);
      record.langkey = PagesStoreService.LANGUAGES[langkey];

      pagesDb.put(_parsePage(record), id)
        .then(function(response) {
          log.debug('add() -> success', response);
          deferred.resolve(response);
        })
        .catch(function(err) {
          log.error('add() -> failed', err);
          deferred.reject(err);
        });
      return deferred.promise;
      // pagesDb.get(id).then(function(doc) {
      //   log.debug('get()', doc);
      //   return pagesDb.put(_parsePage(record), doc._id, doc._rev);
      // }).then(function(response) {
      //   log.debug('update() -> success', response);
      //   deferred.resolve(response);
      // }).catch(function(err) {
      //   log.debug('catch() -> failed', err);
      //   if (err.status === 404) {
      //     pagesDb.put(_parsePage(record), id)
      //       .then(function(response) {
      //         log.debug('add() -> success', response);
      //         deferred.resolve(response);
      //       })
      //       .catch(function(err) {
      //         log.error('add() -> failed', err);
      //         deferred.reject(err);
      //       });
      //   } else {
      //     log.error('reject() -> failed', err);
      //     deferred.reject(err);
      //   }
      // });
    }

    function _parsePage(data) {
      data = angular.copy(data);
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
      pagesDb = pouchDB(PagesStoreService.DBNAME.PAGES, {
        adapter: 'websql'
      });
      historyDb = pouchDB(PagesStoreService.DBNAME.HISTORY, {
        adapter: 'websql'
      });
      deferred.resolve();
      return deferred.promise;
    }

    function _cleanPages() {
      return pagesDb.destroy();
    }

  }
})();