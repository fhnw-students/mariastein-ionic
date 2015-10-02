/**
 * @name roomsStoreService
 * @module kmsscan.services.stores.Settings
 * @author Gerhard Hirschfeld
 *
 * @description
 * This Service Class handel's the settings data. It works with the local
 * database pouchDb to store the data.
 *
 */
(function () {
  'use strict';

  var namespace = 'kmsscan.services.stores.Settings';

  angular
    .module(namespace, [
      'pouchdb',
      'kmsscan.utils.Logger',
      'kmsscan.utils.PouchDb'
    ])
    .factory('settingsStoreService', SettingsStoreService);

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

  function SettingsStoreService($q, Logger, pouchDbUtilsService, $translate) {
    var log = new Logger(namespace);
    var callbacks = [];
    var settingsDb;
    log.debug('init');

    // Public API
    var service = {
      get: get,
      set: set,
      init: init,
      onChange: onChange,
      offChange: offChange,
      clean: _destroy
    };

    _activate();
    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     * @name init
     * @description
     * Initials the settings. So it checks if there are any settings. If not than
     * it fills the database with the default values
     *
     * @returns {deferred.promise|{then, always}}
     */
    function init() {
      var deferred = $q.defer();
      _activate();
      settingsDb.get(SettingsStoreService.TABLENAME)
        .then(function (doc) {
          log.debug('init()', doc);
          $translate.use(doc.language);
          deferred.resolve(doc);
        })
        .catch(function (err) {
          if (err.status === 404) {
            _init()
              .then(function (doc) {
                $translate.use(doc.language);
                deferred.resolve(doc);
              })
              .catch(function (err) {
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

    /**
     * @name get
     * @returns {deferred.promise|{then, always}} Object settings
     */
    function get() {
      var deferred = $q.defer();
      settingsDb.get(SettingsStoreService.TABLENAME)
        .then(function (doc) {
          log.debug('get()', doc);
          deferred.resolve(doc);
        })
        .catch(function (err) {
          log.error('catch() -> failed', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    /**
     * @name set
     * @param newSettings Object
     * @returns {deferred.promise|{then, always}} Object settings
     */
    function set(newSettings) {
      var deferred = $q.defer();
      settingsDb.get(SettingsStoreService.TABLENAME)
        .then(function (doc) {
          return settingsDb.put(_parseSettings(newSettings, doc), doc._id, doc._rev);
        })
        .then(get)
        .then(function (doc) {
          log.debug('update() -> success', doc);
          _fireOnChange(doc);
          deferred.resolve(doc);
        })
        .catch(function (err) {
          log.error('catch() -> failed', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    /**
     * @name onChange
     * @description
     * Adds a new on-change listener
     *
     * @returns {Number} index
     */
    function onChange(fn) {
      return callbacks.push(fn);
    }

    /**
     * @name offChange
     * @description
     * Removes a on-change listener with the given index.
     *
     * @param idx Number
     */
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
        .then(function (doc) {
          log.debug('add() -> success', doc);
          _fireOnChange(doc);
          deferred.resolve(doc);
        })
        .catch(function (err) {
          log.error('add() -> failed', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function _activate() {
      settingsDb = pouchDbUtilsService.createDb(SettingsStoreService.DBNAME);
      var deferred = $q.defer();
      deferred.resolve(settingsDb);
      return deferred.promise;
    }

    function _destroy() {
      return settingsDb.destroy();
    }

  }
})();