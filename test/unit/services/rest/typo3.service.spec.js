/**
 * @name Typo3 service test class
 * @module kmsscan.services.rest.Typo3
 * @author Luca Indermuehle
 *
 * @description
 * This class tests the functionality of typo3.service.js with Unit-Tests
 */
'use strict';
describe('Unit: kmsscan.services.rest.Typo3', function () {

  var typo3Service, $httpBackend, $rootScope, $q;
  beforeEach(module('kmsscan.services.rest.Typo3'));


  beforeEach(inject(function (_typo3Service_, _$httpBackend_, _$rootScope_, _$q_) {
    typo3Service = _typo3Service_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $q = _$q_;

  }));

  /**
   * Checks the correct structure like dependency injection.
   */
  describe('Structure', function () {
    it('should contain an typo3Service',
      inject(function (typo3Service) {
        expect(typo3Service)
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

  /**
   * Checks the public API from the typo3 service
   */
  describe('Public API', function () {

    it('typo3Service.loadPages(DE) - should return a correct json response with pages', function(done) {

      /* ######### Init test ######### */
      $httpBackend.expectGET('http://kloster-mariastein.business-design.ch/index.php?L=DE&id=137&type=5000').respond(pagesJsonDE);

      typo3Service.loadPages('DE')
        .then(testResult)
        .catch(failTest)
        .finally(done);

      $rootScope.$digest();

      $httpBackend.flush();

      /* ######### verify result ######### */
      var testResult = function(res) {
        expect(res.objects.length).to.be.equal(3);
        expect(res.images.length).to.be.equal(2);

        // Stichkontrollen beim einigen Eintraegen
        expect(res.objects[0].title).to.be.equal('Seite 1');
        expect(res.objects[1].uid).to.be.equal(2);
      };

      var failTest = function(error) {
        console.log(error);
        failTest(error);
        //expect(error).toBeUndefined();
      };

    });

    it('typo3Service.loadPages(FR) - should return a correct french json response with the pages', function(done) {

      /* ######### Init test ######### */
      $httpBackend.expectGET('http://kloster-mariastein.business-design.ch/index.php?L=FR&id=137&type=5000').respond(pagesJsonFR);

      typo3Service.loadPages('FR')
          .then(testResult)
          .catch(failTest)
          .finally(done);

      $rootScope.$digest();

      $httpBackend.flush();

      /* ######### verify result ######### */
      var testResult = function(res) {
        expect(res.objects.length).to.be.equal(1);
        expect(res.images.length).to.be.equal(0);

        // Stichkontrollen beim einigen Eintraegen
        expect(res.objects[0].title).to.be.equal('Seite 1 FR');
      };

      var failTest = function(error) {
        console.log(error);
        failTest(error);
        //expect(error).toBeUndefined();
      };

    });

    it('typo3Service.loadRooms(DE) - should return a correct json response with rooms', function(done) {

      /* ######### verify result ######### */
      var testResult = function(res) {
        expect(res[0].image.length).to.be.equal(2);
        //expect(res.rooms.length).to.be.equal(1);

        // Stichkontrollen beim einigen Eintraegen
        //expect(res.rooms[0].title).to.be.equal("Raum 1")
      };

      var failTest = function(error) {
        console.log(error);
        failTest(error);
        //expect(error).toBeUndefined();
      };

      /* ######### Init test ######### */
      $httpBackend.expectGET('httbowp://kloster-mariastein.business-design.ch/index.php?L=DE&id=138&type=5000').respond(roomsJsonDE);

      typo3Service.loadRooms('DE')
          .then(testResult)
          .catch(failTest)
          .finally(done);

      $rootScope.$digest();

      $httpBackend.flush();



    });

  });

  it('typo3Service.loadRooms(IT) - should return a correct json response with rooms', function(done) {

    /* ######### Init test ######### */
    $httpBackend.expectGET('http://kloster-mariastein.business-design.ch/index.php?L=IT&id=138&type=5000').respond(roomsJsonIT);

    typo3Service.loadRooms('IT')
        .then(testResult)
        .catch(failTest)
        .finally(done);

    $rootScope.$digest();

    $httpBackend.flush();

    /* ######### verify result ######### */
    var testResult = function(res) {
      expect(res.images.length).to.be.equal(2);
      expect(res.rooms.length).to.be.equal(2);

      // Stichkontrollen beim einigen Eintraegen
      expect(res.rooms[0].title).to.be.equal("Spazio 1")
    };

    var failTest = function(error) {
      console.log(error);
      failTest(error);
      //expect(error).toBeUndefined();
    };

  });


});

