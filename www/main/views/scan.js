(function () {
    'use strict';

    angular.module('kmsscan.views.Scan', [
        'kmsscan.services.History'
    ])
        .config(StateConfig)
        .controller('ScanCtrl', ScanController);


    function StateConfig($stateProvider) {
        $stateProvider
            .state('menu.scan', {
                url: '/scan',
                views: {
                    'menuContent': {
                        templateUrl: 'main/views/scan.html',
                        controller: 'ScanCtrl as scan'
                    }
                }
            });
    }


    function ScanController($cordovaBarcodeScanner, historyService) {
        var vm = this; // view-model
        var isReady = false;

        vm.scan = scan;

        if (isReady) {
            vm.scan();
        }

        document.addEventListener("deviceready", function () {
            isReady = true;
            vm.scan();
        }, false);


        //////////////////////////////////////////

        function scan (){
            $cordovaBarcodeScanner
                .scan()
                .then(function (barcodeData) {
                    if (barcodeData.cancelled !== 1){
                        if (barcodeData.format == "QR_CODE") {
                            vm.data = barcodeData.text;
                            historyService.add(vm.data);
                            vm.format = false;
                            vm.cancel = false;
                        } else {
                            vm.format = true;
                            vm.cancel = false;
                        }
                    } else {
                        vm.cancel = true;
                        vm.format = false;
                    }
                    // Success! Barcode data is here
                }, function (error) {
                    //vm.data = error;
                    // An error occurred
                });

        }

    }


}());
