/**
 * @name Typo3 service test class
 * @module kmsscan.services.rest.Pages
 * @author Luca Indermuehle
 *
 * @description
 * This class tests the functionality of pagesStore.service.js
 */
'use strict';
describe('Unit: kmsscan.services.stores.Pages', function () {

  var pageStoreService, $httpBackend, $rootScope, $q;
  beforeEach(module('kmsscan.services.stores.Pages'));


  beforeEach(inject(function (_pageStoreService_, _$httpBackend_, _$rootScope_, _$q_) {
    pageStoreService = _pageStoreService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $q = _$q_;

  }));

  describe('Structure', function () {
    it('should contain an pageStoreService',
        inject(function (pageStoreService) {
          expect(pageStoreService)
              .not.to.equal(null);
        })
    );

    it('should return a factory->object',
        inject(function (pageStoreService) {
          expect(pageStoreService)
              .to.be.a('object');
        })
    );
  });

});