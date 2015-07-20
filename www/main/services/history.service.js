(function () {
    'use strict';

    angular
        .module('kmsscan.services.History', [])
        .factory('historyService', HistoryService);

    function HistoryService() {

        var history = [];

        var service = {
            add: add,
            get: get
        };

        return service;

        ////////////////

        function add(id) {
            for (var i = 0; i < history.length; i++) {
                if (history[i].id === id.toString()) {
                    history[i].date = new Date().getTime();
                    return;
                }
            }
            history.push({
                id: id,
                date: new Date().getTime()
            });
        }

        function get(id) {
            if (!id) {
                return history;
            } else {
                for (var i = 0; i < history.length; i++) {
                    if (history[i].id === id.toString()) {
                        return history[i];
                    }
                }
            }
        }
    }
})();