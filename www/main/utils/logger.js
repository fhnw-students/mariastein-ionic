/**
 * @name Logger
 * @module kmsscan.utils.Logger
 * @author Gerhard Hirschfeld
 *
 * @description
 * This Service Class returns a Logger Object. With this Logger
 * Object it is possible to write logs into the console. Those logs
 * have a header and a timestamp.
 *
 */
(function () {
  'use strict';

  angular
    .module('kmsscan.utils.Logger', [])
    .factory('Logger', LoggerService);

  LoggerService.isEnabled = false;

  function LoggerService($log) {

    function Logger(name, enabled) {
      this.name = name;
      if(LoggerService.isEnabled){
        this.enabled = enabled !== false;
      }else{
        this.enabled = false;
      }
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
