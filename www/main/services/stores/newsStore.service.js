(function () {
    'use strict';

    var namespace = 'kmsscan.services.stores.News';

    angular
        .module(namespace, [
            'pouchdb',
            'kmsscan.utils.Logger',
            'kmsscan.utils.Helpers',
            'kmsscan.utils.PouchDb'
        ])
        .factory('newsStoreService', NewsStoreService);

    NewsStoreService.DBNAME = {
        PAGES: 'kmsscan.pages',
        HISTORY: 'kmsscan.history'
    };

    function NewsStoreService($q, Logger, pouchDB, helpersUtilsService, pouchDbUtilsService) {
        var log = new Logger(namespace);

        // Public API
        var service = {
            get: get,
            getList: getList
        };

        //_activate();
        return service;

        ///////////////////////////////////
        /**
         * @name get
         * @param uid Number
         */
        function get(uid){

        }

        function getList(){

        }




    }
})();