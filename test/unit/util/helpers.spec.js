/**
 * @name Util class Helpers test class
 * @module kmsscan.utils.Helpers
 * @author Luca Indermuehle
 *
 * @description
 * This class tests the functionality of the util class helpers.js
 */
'use strict';
describe('Unit: kmsscan.utils.Helpers', function () {

    var helpersUtilsService;
    beforeEach(module('kmsscan.utils.Helpers'));


    beforeEach(inject(function (_helpersUtilsService_) {
        helpersUtilsService = _helpersUtilsService_;
    }));

    describe('Structure', function () {
        it('should contain an typo3Service',
            inject(function (helpersUtilsService) {
                expect(helpersUtilsService)
                    .not.to.equal(null);
            })
        );

        it('should return a factory->object',
            inject(function (typo3Service) {
                expect(typo3Service)
                    .to.be.a('object');
            })
        );
    });

});