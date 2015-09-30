/**
 * @name Settings service test class
 * @module kmsscan.services.stores.Settings
 * @author Luca Indermuehle
 *
 * @description
 * This class tests the functionality of settingsStore.service.js
 */
'use strict';
describe('Unit: kmsscan.services.stores.Settings', function () {

    var settingsStoreService, $httpBackend, $rootScope, $q;
    beforeEach(module('kmsscan.services.stores.Settings'));


    beforeEach(inject(function (_settingsStoreService_, _$httpBackend_, _$rootScope_, _$q_) {
        settingsStoreService = _settingsStoreService_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $q = _$q_;

    }));

    describe('Structure', function () {
        it('should contain an settingsStoreService',
            inject(function (settingsStoreService) {
                expect(settingsStoreService)
                    .not.to.equal(null);
            })
        );

        it('should return a factory->object',
            inject(function (settingsStoreService) {
                expect(settingsStoreService)
                    .to.be.a('object');
            })
        );
    });

});