(function() {
  'use strict';

  angular
    .module('kmsscan.services.stores.Settings', [
      'pouchdb',
      'kmsscan.utils.Logger'
    ])
    .factory('settingsStoreService', SettingsStoreService);

  /**
   * STATIC VARS
   */
  SettingsStoreService.DBNAME = 'kmsscan.settings';
  SettingsStoreService.TABLENAME = 'mySettings';

  var sysLang = angular.uppercase(navigator.language.substring(0, 2));
  SettingsStoreService.DEFAULTS = {
    language: (sysLang === 'DE' || sysLang === 'FR' || sysLang === 'IT') ? sysLang : 'EN',
    vibration: true,
    music: false,
    isPristine: true,
    zooming: false
  };

  /**
   * Service Class
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function SettingsStoreService($q, Logger, pouchDB) {
    var log = new Logger('kmsscan.services.stores.Settings');
    var callbacks = [];
    var settingsDb;
    log.debug('init');

    // Public API
    var service = {
      get: get,
      set: set,

      init: init,
      onChange: onChange,
      offChange: offChange
    };

    _activate();
    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function init() {
      var deferred = $q.defer();
      settingsDb.get(SettingsStoreService.TABLENAME)
        .then(function(doc) {
          log.debug('init()', doc);
          deferred.resolve(doc);
        })
        .catch(function(err) {
          if (err.status === 404) {
            _init()
              .then(deferred.resolve)
              .catch(function(err) {
                log.error('catch() -> failed', err);
                deferred.reject(err);
              });
          } else {
            log.error('catch() -> failed', err);
            deferred.reject(err);
          }
        });
      return deferred.promise;
    }

    function get() {
      var deferred = $q.defer();
      settingsDb.get(SettingsStoreService.TABLENAME)
        .then(function(doc) {
          log.debug('get()', doc);
          deferred.resolve(doc);
        })
        .catch(function(err) {
          log.error('catch() -> failed', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function set(newSettings) {
      var deferred = $q.defer();
      settingsDb.get(SettingsStoreService.TABLENAME)
        .then(function(doc) {
          return settingsDb.put(_parseSettings(newSettings, doc), doc._id, doc._rev);
        })
        .then(get)
        .then(function(doc) {
          log.debug('update() -> success', doc);
          _fireOnChange(doc);
          deferred.resolve(doc);
        })
        .catch(function(err) {
          log.error('catch() -> failed', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function onChange(fn) {
      return callbacks.push(fn);
    }

    function offChange(idx) {
      callbacks.splice(idx, 1);
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    function _fireOnChange(doc) {
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i](doc);
      }
    }

    function _parseSettings(newSettings, settings) {
      settings.language = newSettings.language || settings.language || SettingsStoreService.DEFAULTS.language;
      settings.music = _parseBoolean(newSettings.music);
      settings.zooming = _parseBoolean(newSettings.zooming);
      settings.vibration = _parseBoolean(newSettings.vibration);
      settings.isPristine = _parseBoolean(newSettings.isPristine);
      return settings;
    }

    function _parseBoolean(val) {
      return val === true;
    }

    function _init() {
      var deferred = $q.defer();
      settingsDb.put(SettingsStoreService.DEFAULTS, SettingsStoreService.TABLENAME)
        .then(get)
        .then(function(doc) {
          log.debug('add() -> success', doc);
          _fireOnChange(doc);
          deferred.resolve(doc);
        })
        .catch(function(err) {
          log.error('add() -> failed', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function _activate() {
      var deferred = $q.defer();
      settingsDb = pouchDB(SettingsStoreService.DBNAME, {
        adapter: 'websql'
      });
      deferred.resolve();
      return deferred.promise;
    }

    function _destroy() {
      return settingsDb.destroy();
    }

  }
})();