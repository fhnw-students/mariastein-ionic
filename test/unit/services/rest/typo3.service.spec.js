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

  describe('Public API', function () {
    //beforeEach(function() {
    //
    //});

    //it('should return a promise', function () {
      //expect(typo3Service.loadPages('DE').then).toBeDefined();
    //});


    it('should fetch an employee', function(done) {
      var testEmployee = function(res) {
        console.log(res);
        expect(res).to.be.a('object');
      };

      var failTest = function(error) {
        console.log(error);
        //expect(error).toBeUndefined();
      };

      $httpBackend.expectGET('http://kloster-mariastein.business-design.ch/routing/klomaapp/page/json?L=DE')
        .respond(pagesJson);

      typo3Service.loadPages('DE')
        .then(testEmployee)
        .catch(failTest)
        .finally(done);

      $rootScope.$digest();

      $httpBackend.flush();

    });


    it('should simulate promise', inject(function ($q, $rootScope, typo3Service) {

      //var resolvedValue;
      //
      //typo3Service.loadPages('DE')
      //  .then(function (res) {
      //    console.log(res);
      //    resolvedValue = res;
      //  })
      //  .catch(function (err) {
      //    console.log(err);
      //  });
      //
      //// Propagate promise resolution to 'then' functions using $apply().
      //$rootScope.$apply();
      //$rootScope.$digest();
      //expect(resolvedValue).to.be.a('object');
    }));

    //it('should resolve with [something]', function () {
    //  var data;
    //
    //  // set up a deferred
    //  var deferred = $q.defer();
    //  // get promise reference
    //  var promise = deferred.promise;
    //
    //  // set up promise resolve callback
    //  promise.then(function (response) {
    //    data = response.success;
    //
    //    // make your actual test
    //    expect(data).to.be.a('object');
    //  });
    //
    //  typo3Service.loadPages('DE').then(function(response) {
    //    // resolve our deferred with the response when it returns
    //    deferred.resolve(response);
    //  });
    //
    //  // force `$digest` to resolve/reject deferreds
    //  $rootScope.$digest();
    //
    //
    //});

    //it('typo3Service.loadPages() - should return an object with pages and images',
    //  inject(function(typo3Service, $rootScope, $httpBackend, $q) {
    //    $httpBackend.expectGET('http://kloster-mariastein.business-design.ch/routing/klomaapp/page/json?L=DE')
    //      .respond(pagesJson);
    //
    //    typo3Service.loadPages('DE')
    //      .then(function(res) {
    //        console.log(res);
    //        expect(res)
    //          .to.be.a('object');
    //      })
    //      .catch(function(err) {
    //        console.log(err);
    //      });
    //
    //    $rootScope.$digest();
    //  })
    //);
  });

});