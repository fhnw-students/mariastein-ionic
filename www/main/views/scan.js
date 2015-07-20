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


    function ScanController($cordovaBarcodeScanner, historyService, $cordovaVibration) {
        var vm = this; // view-model
        vm.isReady = false;
        vm.barcodeText = "";

        vm.scan = scan;
        vm.submit = submit;

        if (vm.isReady) {
            vm.scan();
        }


        document.addEventListener("deviceready", function () {
            vm.isReady = true;
            vm.scan();
        }, false);


        //////////////////////////////////////////

        function scan (){
            $cordovaBarcodeScanner
                .scan()
                .then(function (barcodeData) {
                    $cordovaVibration.vibrate(100);
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

        function submit(){
            if (vm.barcodeText !== ""){
                historyService.add(vm.barcodeText);
                vm.barcodeText="";
            }
        }

    }


}());
