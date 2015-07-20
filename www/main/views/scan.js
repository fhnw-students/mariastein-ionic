(function () {
    'use strict';

    angular.module('kmsscan.views.Scan', [])
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


    function ScanController($cordovaBarcodeScanner) {
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
                    vm.data = barcodeData;
                    // Success! Barcode data is here
                }, function (error) {
                    vm.data = error;
                    // An error occurred
                });

        }

    }


}());
