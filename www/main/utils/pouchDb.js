(function () {
  'use strict';

  var namespace = 'kmsscan.utils.PouchDb';

  angular
    .module(namespace, [
      'pouchdb',
      'kmsscan.utils.Logger'
    ])
    .factory('pouchDbUtilsService', HelpersUtilsService);

  function HelpersUtilsService($q, pouchDB, Logger) {
    var log = new Logger(namespace);

    return {
      createDb: createDb,
      destroyDb: destroyDb

    };

    ////////////////////////////////////////////////////////

    /**
     * @name createDb
     *
     * @param dbname String
     * @returns Promise<Object>
     */
    function createDb(dbname) {
      return pouchDB(dbname, {
        adapter: 'websql'
      });
    }

    /**
     * @name destroyDb
     *
     * @param db Object
     * @returns Promise<Object>
     */
    function destroyDb(db) {
      try {
        return db.destroy();
      } catch (error) {
        log.error('destroyDb', error);
      }

    }

  }

}());
