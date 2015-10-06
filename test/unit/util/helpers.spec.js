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


    /**
     * Checks the public API from the hlper util class
     */
    describe('Public API', function () {

        it('helper.hasUid(..) positive - should check if the given list the given uid contains',
            inject(function (helpersUtilsService) {
                // init tests
                var list = [{uid :"12"},{uid :"13"},{uid :"14"},{uid :"15"}];
                var uid = "13";

                // run tests
                var result = helpersUtilsService.hasUid(list, uid);

                // verify
                expect(result).to.be.TRUE;

            })
        );


        it('helper.hasUid(..) negative - should check if the given list the given uid contains',
            inject(function (helpersUtilsService) {
                // init tests
                var list = [{uid :"12"},{uid :"13"},{uid :"14"},{uid :"15"}];
                var uid = "16";

                // run tests
                var result = helpersUtilsService.hasUid(list, uid);

                // verify
                expect(result).to.be.FALSE;

            })
        );

        it('helper.getByUid(..) positive - should return the correct element from the list corresponding to the given uid',
            inject(function (helpersUtilsService) {
                // init
                var expectedObject = {uid:"12", name:"test"}
                var list = [expectedObject,{uid :"13"},{uid :"14"},{uid :"15"}];
                var uid = "12";

                // run tests
                var result = helpersUtilsService.getByUid(list, uid);

                // verify
                expect(result).to.be.equal(expectedObject);

            })
        );

        it('helper.getByUid(..) negative - should return the correct element from the list corresponding to the given uid',
            inject(function (helpersUtilsService) {
                // init
                var list = [{uid :"12"},{uid :"13"},{uid :"14"},{uid :"15"}];
                var uid = "11";

                // run tests
                var result = helpersUtilsService.getByUid(list, uid);

                // verify
                expect(result).to.be.equal(undefined);

            })
        );

        it('helper.filterDocsWithSameLangKey(..) positive - should return the correct document with the given langKey',
            inject(function (helpersUtilsService) {
                // init
                var expectedResult1 = {doc:"IT.txt", langKey:"IT"};
                var list = [{doc:"DE.txt", langKey:"DE"},expectedResult1,{doc:"IT_2.txt", langKey:"IT"},{doc:"FR.txt", langKey:"FR"}];
                var langKey = "IT";

                // run tests
                var result = helpersUtilsService.filterDocsWithSameLangKey(list, langKey);

                // verify
                expect(result.length).to.be.equal(2);
                expect(result[0]).to.be.equal(expectedResult1);

            })
        );


        it('helper.filterDocsWithSameLangKey(..) negative - should return the correct document with the given langKey',
            inject(function (helpersUtilsService) {
                // init
                var list = [{doc:"DE.txt", langKey:"DE"},{doc:"IT.txt", langKey:"IT"},{doc:"FR.txt", langKey:"FR"}];
                var langKey = "EN";

                // run tests
                var result = helpersUtilsService.filterDocsWithSameLangKey(list, langKey);

                // verify
                expect(result.length).to.be.equal(0);

            })
        );

        it('helper.getLanguageValueByKey(..) positive - should return the correct languageKey (number for backend) from the languageConstants corresponding to the given language',
            inject(function (helpersUtilsService) {
                // init
                var langKey = "FR";

                // run tests
                var result = helpersUtilsService.getLanguageValueByKey(langKey);

                // verify
                expect(result).to.be.equal(1);


                // init
                var langKey = "DE";

                // run tests
                var result = helpersUtilsService.getLanguageValueByKey(langKey);

                // verify
                expect(result).to.be.equal(0);

            })
        );


        it('helper.getLanguageValueByKey(..) negative - should return the correct languageKey (number for backend) from the languageConstants corresponding to the given language',
            inject(function (helpersUtilsService) {
                // init
                var langKey = "KR";

                // run tests
                var result = helpersUtilsService.getLanguageValueByKey(langKey);

                // verify
                expect(result).to.be.equal(undefined);

            })
        );

        it('helper.getLanguageKeyByValue(..) positive - should return the correct language from the languageConstants corresponding to the given language key (number for backend)',
            inject(function (helpersUtilsService) {
                // init
                var langKey = 0;

                // run tests
                var result = helpersUtilsService.getLanguageKeyByValue(langKey);

                // verify
                expect(result).to.be.equal("DE");


                // init
                var langKey = 1;

                // run tests
                var result = helpersUtilsService.getLanguageKeyByValue(langKey);

                // verify
                expect(result).to.be.equal("FR");

            })
        );


        it('helper.getLanguageValueByKey(..) positive - should return the correct language from the languageConstants corresponding to the given language key (number for backend)',
            inject(function (helpersUtilsService) {
                // init
                var langKey = 8;

                // run tests
                var result = helpersUtilsService.getLanguageKeyByValue(langKey);

                // verify
                expect(result).to.be.equal(undefined);

            })
        );



    });

    });