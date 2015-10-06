/**
 * @name PagesStore service test class
 * @module kmsscan.services.rest.Pages
 * @author Luca Indermuehle
 *
 * @description
 * This class tests the functionality of pagesStore.service.js with Unit-Tests
 */
'use strict';
describe('Unit: kmsscan.services.stores.Pages', function () {

  var pagesStoreService, $httpBackend, $rootScope, $q;
  beforeEach(module('kmsscan.services.stores.Pages'));


  beforeEach(inject(function (_pagesStoreService_, _$httpBackend_, _$rootScope_, _$q_) {
      pagesStoreService = _pagesStoreService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $q = _$q_;

  }));

  /**
   * Checks the correct structure like dependency injection.
   */
  describe('Structure', function () {
    it('should contain an pageStoreService',
        inject(function (pagesStoreService) {
          expect(pagesStoreService)
              .not.to.equal(null);
        })
    );

    it('should return a factory->object',
        inject(function (pagesStoreService) {
          expect(pagesStoreService)
              .to.be.a('object');
        })
    );
  });

});