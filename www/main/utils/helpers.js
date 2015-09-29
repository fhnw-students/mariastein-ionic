/**
 * @name helpersUtilsService
 * @module kmsscan.utils.Helpers
 * @author Gerhard Hirschfeld
 *
 * @description
 * This Service Class has some useful helper function, which are
 * used in several other services or controllers
 *
 */
(function () {
  'use strict';

  angular
    .module('kmsscan.utils.Helpers', [
      'kmsscan.translateConfig'
    ])
    .factory('helpersUtilsService', HelpersUtilsService);

  function HelpersUtilsService(languagesConstant) {

    return {
      hasUid: hasUid,
      getByUid: getByUid,
      filterDocsWithSameLangKey: filterDocsWithSameLangKey,
      getLanguageValueByKey: getLanguageValueByKey,
      getLanguageKeyByValue: getLanguageKeyByValue,
      buildDocId: buildDocId
    };

    ////////////////////////////////////////////////////////

    /**
     * @name hasUid
     * @description
     * Validates if the collection of docs has a doc with the given UID
     *
     * @param list Array<doc>
     * @param uid String or Number
     * @returns {boolean}
     */
    function hasUid(list, uid) {
      list = list || [];
      for (var i = 0; i < list.length; i++) {
        if (parseInt(uid, 10) === parseInt(list[i].uid, 10)) {
          return true;
        }
      }
      return false;
    }

    /**
     * @name getByUid
     * @description
     * Filters the collection of docs with the given UID and returns
     * the result.
     *
     * @param list Array<doc>
     * @param uid String or Number
     * @returns doc Object or undefined
     */
    function getByUid(list, uid) {
      list = list || [];
      for (var i = 0; i < list.length; i++) {
        if (parseInt(uid, 10) === parseInt(list[i].uid, 10)) {
          return list[i];
        }
      }
      return undefined;
    }

    /**
     * @name filterDocsWithSameLangKey
     * @description
     * Filters all the docs with the given language-key
     *
     * @param list Array<doc>
     * @param langkey Number
     * @returns Array<doc>
     */
    function filterDocsWithSameLangKey(list, langkey) {
      return list.filter(function (doc) {
        return langkey === doc.langkey;
      });
    }


    /**
     * @name getLanguageValueByKey
     * @param key String
     * @return Number
     */
    function getLanguageValueByKey(key) {
      for (var i = 0; i < languagesConstant.length; i++) {
        if (key === languagesConstant[i]) {
          return i;
        }
      }
    }

    /**
     * @name getLanguageValueByKey
     * @param value Number
     * @return String
     */
    function getLanguageKeyByValue(value) {
      for (var i = 0; i < languagesConstant.length; i++) {
        if (value === i) {
          return languagesConstant[i];
        }
      }
    }

    /**
     * @name buildDocId
     * @param uid Number
     * @param langkey String
     * @returns String
     */
    function buildDocId(uid, langkey) {
      return uid.toString() + '-' + langkey;
    }


  }

}());
