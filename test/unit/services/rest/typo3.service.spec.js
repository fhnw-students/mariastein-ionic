'use strict';
describe('Unit: kmsscan.services.rest.Typo3', function() {

  var typo3Service, $httpBackend;
  beforeEach(module('kmsscan.services.rest.Typo3'));

  beforeEach(inject(function(_typo3Service_, _$httpBackend_) {
    typo3Service = _typo3Service_;
    $httpBackend = _$httpBackend_;
  }));

  describe('Structure', function() {
    it('should contain an typo3Service',
      inject(function(typo3Service) {
        expect(typo3Service)
          .not.to.equal(null);
      })
    );

    it('should return a factory->object',
      inject(function(typo3Service) {
        expect(typo3Service)
          .to.be.a('object');
      })
    );
  });

  describe('Public API', function() {
    beforeEach(function() {
      $httpBackend.whenGET('http://kloster-mariastein.business-design.ch/routing/klomaapp/page/json')
        .respond(pagesJson);
    });
    it('typo3Service.loadPages() - should return an object with pages and images',
      inject(function(typo3Service) {
        typo3Service.loadPages('DE')
          .then(function(res) {
            expect(res)
              .to.be.a('object');
          })
          .catch(function(err) {

          });
      })
    );
  });

});