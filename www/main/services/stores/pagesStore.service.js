/**
 * @name pagesStoreService
 * @module kmsscan.services.stores.Pages
 * @author Gery Hirschfeld
 *
 * @description
 * This Service Class handel's the pages data. Pages data are objects to scan, special-contents
 * or news. This service works with the local database pouchDb to store and sync the data.
 *
 */
(function () {
  'use strict';

  var namespace = 'kmsscan.services.stores.Pages';

  angular
    .module(namespace, [
      'pouchdb',
      'kmsscan.utils.Logger',
      'kmsscan.utils.Helpers',
      'kmsscan.utils.PouchDb'
    ])
    .factory('pagesStoreService', PagesStoreService);

  PagesStoreService.DBNAME = {
    PAGES: 'kmsscan.pages',
    HISTORY: 'kmsscan.history'
  };

  PagesStoreService.TYPES = {
    NEWS: 'news',
    OBJECT: 'content',
    SPECIAL: 'special-content'
  };

  PagesStoreService.WELCOME_PAGE_UID = 3;

  function PagesStoreService($q, Logger, helpersUtilsService, pouchDbUtilsService) {
    var log = new Logger(namespace);
    var pagesDb, historyDb;
    log.debug('init');

    // Public API
    var service = {
      get: get,
      getWelcomePage: getWelcomePage,
      getNews: getNews,
      getVisited: getVisitedObjects,
      visited: visitedByQrCode,
      visitedByUid: visitedByUid,
      sync: sync,
      clean: clean
    };

    _activate();
    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     * @name get
     * @description
     * Returns a promise which resolves a doc with the given uid and langKey(like 'DE', 'EN' etc.)
     *
     * @param uid Number
     * @param langKey String
     * @returns Promise<doc>
     */
    function get(uid, langKey) {
      return pagesDb.get(helpersUtilsService.buildDocId(uid, langKey))
        .then(function (page) {
          page.image = JSON.parse(page.image);
          page.date = moment(page.date);
          return page;
        });
    }

    /**
     * @name getWelcomePage
     * @description
     * Returns the welcome page in the specified language
     *
     * @param langKey String
     * @returns Promise<doc>
     */
    function getWelcomePage(langKey) {
      return get(PagesStoreService.WELCOME_PAGE_UID, langKey);
    }

    /**
     * @name getNews
     * @description
     * Returns all pages with the type news and appends the visited date
     * from the history database
     *
     * @param langKey String
     * @returns Promise<Array<doc>>
     */
    function getNews(langKey) {
      return $q.all([
        pagesDb.allDocs({
          'include_docs': true
        }),
        historyDb.allDocs({
          'include_docs': true
        })
      ])
        .then(_parseDocs)
        .then(function (results) {
          results[0] = _filterByType(results[0], PagesStoreService.TYPES.NEWS);
          return results;
        })
        .then(function (results) {
          var docs = helpersUtilsService.filterDocsWithSameLangKey(results[0], langKey);
          docs = _appendVisitedDate(docs, results[1]);
          docs = docs.map(function (doc) {
            doc.date = moment(doc.date * 1000);
            return doc;
          });
          return docs
            .map(function (doc) {
              doc.image = JSON.parse(doc.image);
              return doc;
            });
        });
    }

    /**
     * @name getVisitedObjects
     * @description
     * Returns all visited pages with the type content(Objects to scan).
     *
     * @param langKey String
     * @returns Promise<Array<doc>>
     */
    function getVisitedObjects(langKey) {
      return $q.all([
        pagesDb.allDocs({
          'include_docs': true
        }),
        historyDb.allDocs({
          'include_docs': true
        })
      ])
        .then(_parseDocs)
        .then(function (results) {
          results[0] = _filterByType(results[0], PagesStoreService.TYPES.OBJECT);
          return results;
        })
        .then(function (results) {
          var ids = _parseDocIds(results[1]);
          var docs = helpersUtilsService.filterDocsWithSameLangKey(results[0], langKey);
          docs = _filterVisitedDocs(docs, ids);
          docs = _appendVisitedDate(docs, results[1]);
          return docs
            .map(function (doc) {
              doc.image = JSON.parse(doc.image);
              return doc;
            });
        });
    }

    /**
     * @name visitedByUid
     * @description
     * Sets a new visited date at the docs with the given uid
     *
     * @param uid Number
     * @returns Promise<Number> uid
     */
    function visitedByUid(uid) {
      return _visited('uid', uid);
    }

    /**
     * @name visitedByQrCode
     * @description
     * Sets a new visited date at the docs with the given qrcode
     *
     * @param qrcode String
     * @returns Promise<Number> uid
     */
    function visitedByQrCode(qrcode) {
      return _visited('qrcode', qrcode);
    }

    /**
     * @name sync
     * @description
     * This method is called by app.run.js for the synchronisation.
     *
     * @param langKey String
     * @param data Array<Object>
     * @returns deferred.promise|{then, always} data Array<Object>
     */
    function sync(langKey, data) {
      var deferred = $q.defer();
      log.debug('sync', data);
      _activate()
        .then(function () {
          return _sync(langKey, data);
        })
        .then(_createIndex)
        .then(function () {
          log.debug('success');
          deferred.resolve(data);
        })
        .catch(function (err) {
          log.error('failed', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    /**
     * @name clean
     * @description
     * Destroys the local database with all the pages, but not the history of scans
     *
     * @returns {Promise.<Object>}
     */
    function clean() {
      return pouchDbUtilsService.destroyDb(pagesDb);
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    function _filterByType(array, type) {
      return array.filter(function (doc) {
        return doc.type === type;
      });
    }

    function _appendVisitedDate(docs, visited) {
      return docs.map(function (doc) {
        doc.visitedAt = visited
          .filter(function (item) {
            return item._id === doc.uid.toString();
          })
          .map(function (item) {
            return item.visitedAt;
          });
        if (doc.visitedAt && doc.visitedAt.length > 0) {
          doc.visitedAt = moment(doc.visitedAt[0]);
        } else {
          doc.visitedAt = undefined;
        }
        return doc;
      });
    }

    function _filterVisitedDocs(docs, visitedIds) {
      return docs.filter(function (doc) {
        if (doc.uid) {
          return visitedIds.indexOf(doc.uid.toString()) >= 0;
        }
        return false;
      });
    }

    function _parseDocIds(array) {
      return array.map(function (doc) {
        return doc._id;
      });
    }

    function _parseDocs(array) {
      for (var i = 0; i < array.length; i++) {
        array[i] = _parseDoc(array[i]);
      }
      return array;
    }

    function _parseDoc(array) {
      return array.rows.map(function (item) {
        return item.doc;
      });
    }

    function _visited(key, value) {
      var deferred = $q.defer();
      var selector = {};
      if (key === 'uid') {
        value = parseInt(value, 10);
      }
      selector[key] = {
        $eq: value
      };
      pagesDb.find({
        selector: selector
      })
        //pagesDb.find({
        //  selector: {
        //    uid: {$eq: parseInt(value,10)}
        //  }
        //})
        .then(_setVisited)
        .then(function (uid) {
          log.debug('query() - success', uid);
          deferred.resolve(uid);
        })
        .catch(function (err) {
          log.error('query() - failed', err);
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function _setVisited(response) {
      var docs = response.docs;
      var id = docs[0].uid.toString();
      var visitedAt = new Date();
      var deferred = $q.defer();
      log.debug('_visited', docs);
      if (_.isArray(docs) && docs.length > 0) {
        historyDb.get(id)
          .then(function (doc) {
            doc.visitedAt = visitedAt;
            return historyDb.put(doc);
          })
          .then(function () {
            deferred.resolve(id);
          })
          .catch(function (err) {
            if (err.status === 404) {
              historyDb.put({
                visitedAt: visitedAt
              }, id)
                .then(function (response) {
                  log.debug('add() -> success', response);
                  deferred.resolve(id);
                })
                .catch(function (err) {
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
          fields: ['uid', 'qrcode', 'langkey']
        }
      });
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

      record.langkey = helpersUtilsService.getLanguageKeyByValue(langkey);
      var id = helpersUtilsService.buildDocId(record.uid, record.langkey);

      pagesDb.put(_parsePage(record), id)
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

    function _parsePage(data) {
      data = angular.copy(data);
      data.room = data.room && data.room.uid;

      if (data.image) {
        data.image = data.image.map(function (image) {
          return image.uid;
        });
        data.image = JSON.stringify(data.image);
      }

      return data;
    }

    function _activate() {
      pagesDb = pouchDbUtilsService.createDb(PagesStoreService.DBNAME.PAGES);
      historyDb = pouchDbUtilsService.createDb(PagesStoreService.DBNAME.HISTORY);
      var deferred = $q.defer();
      deferred.resolve([
        pagesDb, historyDb
      ]);
      return deferred.promise;
    }


  }
})();