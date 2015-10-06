/**
 * @name RoomsStore service test class
 * @module kmsscan.services.stores.Rooms
 * @author Luca Indermuehle
 *
 * @description
 * This class tests the functionality of roomsStore.service.js with Unit-Tests
 */
'use strict';
describe('Unit: kmsscan.services.stores.Rooms', function () {

    var roomsStoreService, $httpBackend, $rootScope, $q;
    beforeEach(module('kmsscan.services.stores.Rooms'));


    beforeEach(inject(function (_roomsStoreService_, _$httpBackend_, _$rootScope_, _$q_) {
        roomsStoreService = _roomsStoreService_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $q = _$q_;

    }));

    /**
     * Checks the correct structure like dependency injection.
     */
    describe('Structure', function () {
        it('should contain an roomsStoreService',
            inject(function (roomsStoreService) {
                expect(roomsStoreService)
                    .not.to.equal(null);
            })
        );

        it('should return a factory->object',
            inject(function (roomsStoreService) {
                expect(roomsStoreService)
                    .to.be.a('object');
            })
        );
    });

});