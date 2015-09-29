(function () {
  'use strict';

  angular
    .module('kmsscan.utils.Logger', [])
    .factory('Logger', LoggerService);

  function LoggerService($log) {

    function Logger(name, enabled) {
      this.name = name;
      this.enabled = enabled !== false;
    }

    Logger.prototype.debug = function (text, object) {
      if (this.enabled) {
        this._log('log', text, object);
      }
    };

    Logger.prototype.info = function (text, object) {
      this._log('info', text, object);
    };

    Logger.prototype.warn = function (text, object) {
      this._log('warn', text, object);
    };

    Logger.prototype.error = function (text, object) {
      this._log('error', text, object);
    };

    Logger.prototype._log = function (type, text, object) {
      object = (_.isObject(text) || _.isArray(text))
        ? text
        : object;

      text = (_.isObject(text) || _.isArray(text))
        ? undefined
        : text;

      text = text || '';

      if (_.isBoolean(object)) {
        object = (object) ? 'YES' : 'NO';
      }

      object = object || '';


      var arrow = (text !== '' || object !== '') ? '=> ' : '';
      $log[type]('[' + getTimestamp() + ' - ' + this.name + '] ' + arrow + text, object);
    };

    ////////////////////////////////////

    return function (name, enabled) {
      return new Logger(name, enabled);
    };

    function getTimestamp() {
      return moment().format('HH:mm:ss.ms');
    }

  }

}());
