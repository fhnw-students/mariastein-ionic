/**
 * @name Util class Helpers test class
 * @module kmsscan.utils.Helpers
 * @author Luca Indermuehle
 *
 * @description
 * This class tests the functionality of the util class helpers.js with Unit-Tests
 */
'use strict';
describe('Unit: kmsscan.utils.Helpers', function () {

    var helpersUtilsService;
    beforeEach(module('kmsscan.utils.Helpers'));


    beforeEach(inject(function (_helpersUtilsService_) {
        helpersUtilsService = _helpersUtilsService_;
    }));

    /**
     * Checks the correct structure like dependency injection.
     */
    describe('Structure', function () {
        it('should contain an helpersUtilsService',
            inject(function (helpersUtilsService) {
                expect(helpersUtilsService)
                    .not.to.equal(null);
            })
        );

        it('should return a factory->object',
            inject(function (helpersUtilsService) {
                expect(helpersUtilsService)
                    .to.be.a('object');
            })
        );
    });

});