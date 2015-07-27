'use strict';

describe('Unit: historyService', function () {

  var historyService;
  beforeEach(module('kmsscan.services.History'));
  beforeEach(inject(function (_historyService_) {
    historyService = _historyService_;
  }));

  it('should contain an c3.common.services.BackendService factory',
    inject(function (historyService) {
      expect(historyService).not.to.equal(null);
    })
  );

  it('should return a factory->object',
    inject(function (historyService) {
      expect(historyService).to.be.a('object');
    })
  );

  //it('should have a method, which returns a string',
  //  inject(function (historyService) {
  //    expect(historyService.method()).to.be.a('string');
  //  })
  //);


});
