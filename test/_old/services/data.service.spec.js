'use strict';
describe('Unit: dataService', function () {

  var csvData = 'ID,Name,Text,Long Text,Images' +
    '1,Object A,"A Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.","A Long Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",a.png' +
    '2,Object B,"B Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.","B Long Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.","b-1.png, b-2.png"' +
    '3,Object C,"C Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.","C Long Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",c.png';

  var dataService;
  var store = {};
  var $httpBackend;

  beforeEach(module('kmsscan.services.Data'));

  beforeEach(inject(function (_dataService_, _$httpBackend_) {
    dataService = _dataService_;
    $httpBackend = _$httpBackend_;
  }));

  describe('Structure', function () {
    it('should contain an dataService',
      inject(function (dataService) {
        expect(dataService).not.to.equal(null);
      })
    );

    it('should return a factory->object',
      inject(function (dataService) {
        expect(dataService).to.be.a('object');
      })
    );
  });

  describe('Data import', function () {
    beforeEach(function () {
      $httpBackend.whenGET('data/dataset.csv').respond(csvData);
    });

    it('should not be fulfilled until the data has been loaded',
      inject(function (dataService) {
        expect(dataService.isFulfilled()).to.false;
      })
    );

    it('should be fulfilled after data import',
      inject(function (dataService) {
        dataService.loadCsv()
          .then(function (result) {
            expect(dataService.isFulfilled()).to.true;
            expect(result).to.be.a('array');
            expect(result).to.not.be.empty;
          });
      })
    );

  });

  describe('After data import', function () {
    beforeEach(function () {
      $httpBackend.whenGET('data/dataset.csv').respond(csvData);
    });

    it('should have the item with the id 1',
      inject(function (dataService) {
        expect(dataService.has(1)).to.be.false;

        dataService.loadCsv()
          .then(function(){
            expect(dataService.has(7)).to.be.false;
            expect(dataService.has(1)).to.be.true;


            expect(dataService.get(1)).to.be.a('object');
            expect(dataService.get(1)).to.not.be.empty;
          });
      })
    );



  });


});

