'use strict';

describe('Unit: historyService', function () {

  var historyService;
  var store = {};

  beforeEach(module('kmsscan.services.History'));

  beforeEach(inject(function (_historyService_) {
    historyService = _historyService_;
  }));

  describe('Structure', function () {
    it('should contain an historyService',
      inject(function (historyService) {
        expect(historyService).not.to.equal(null);
      })
    );

    it('should return a factory->object',
      inject(function (historyService) {
        expect(historyService).to.be.a('object');
      })
    );
  });

  describe('Without history', function () {
    beforeEach(function () {
      historyService.set([]);
    });

    it('should have no history',
      inject(function (historyService) {
        historyService.get()
          .then(function (result) {
            expect(result).to.be.a('array');
            expect(result).to.be.empty;
          });
      })
    );

    it('should not find the history item wiht the id 1',
      inject(function (historyService) {
        historyService.get(1)
          .then(function (result) {
            expect(result).to.be.a('object');
            expect(result).to.be.empty;
          });
      })
    );

  });

  describe('With history', function () {
    beforeEach(function () {
      historyService.set([{"data":{"ID":"2","Name":"Object B","Text":"B Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.","Long Text":"B Long Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.","Images":"b-1.png, b-2.png"},"stamp":1437403624125},{"data":{"ID":"1","Name":"Object A","Text":"A Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.","Long Text":"A Long Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.","Images":"a.png"},"stamp":1437986472852}]);
    });

    it('should have 2 history items',
      inject(function (historyService) {
        historyService.get()
          .then(function (result) {
            expect(result).to.be.a('array');
            expect(result).to.have.length(2);
          });
      })
    );


    it('should have the history item with the id 1',
      inject(function (historyService) {
        historyService.get(1)
          .then(function (result) {
            expect(result).to.be.a('object');
            expect(result).to.have.any.keys('data', 'stamp');
          });
      })
    );


  });

});

