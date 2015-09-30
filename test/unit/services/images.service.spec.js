/**
 * Created by Luecu on 29.09.2015.
 */
/**
 * @name Images service test class
 * @module kmsscan.services.Images
 * @author Luca Indermuehle
 *
 * @description
 * This class tests the functionality of images.service.js
 */
'use strict';
describe('Unit: kmsscan.services.Images', function () {

    var imagesService, $httpBackend, $rootScope, $q;
    beforeEach(module('kmsscan.services.Images'));


    beforeEach(inject(function (_imagesService_, _$httpBackend_, _$rootScope_, _$q_) {
        imagesService = _imagesService_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $q = _$q_;

    }));

    describe('Structure', function () {
        it('should contain an imagesService',
            inject(function (imagesService) {
                expect(imagesService)
                    .not.to.equal(null);
            })
        );

        it('should return a factory->object',
            inject(function (imagesService) {
                expect(imagesService)
                    .to.be.a('object');
            })
        );
    });

});