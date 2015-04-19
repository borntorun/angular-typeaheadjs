(function() {
    'use strict';

    angular.module('appdemo', ['angularTypeaheadjs'])
        .controller('RemotePrefetchCtrl', [ '$scope', RemotePrefetchCtrl ]);

    function RemotePrefetchCtrl() {
        var vm = this;
        vm.itemonSelected = [];
        vm.prefetch = 'data/countries.json'
        vm.remote = 'data/%QUERY.json';
        vm.onSelected = function (item) {
            for(var i = vm.itemonSelected.length - 1; i >= 0; i--) {
                if(vm.itemonSelected[i] === item.name) {
                    vm.itemonSelected.splice(i, 1);
                }
            }
            vm.itemonSelected.push(item.name);
            vm.itemonCursorChanged = '';
        };
        vm.onCursorChanged = function(item) {
            vm.itemonCursorChanged = item.name;
        };
        vm.onClosed = function() {
            vm.itemonCursorChanged = '';
        };
    }
}());
