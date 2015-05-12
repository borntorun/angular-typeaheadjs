(function () {
    'use strict';
    angular.module('appdemo', ['angularTypeaheadjs'])
        .controller('RemotePrefetchCtrl', [ '$scope', RemotePrefetchCtrl ]);
    function RemotePrefetchCtrl($scope) {
        var vm = this;
        vm.itemonSelected = [];
        vm.ttoptions = {
            prefetch: 'data/countries.json',
            remote: 'data/%QUERY.json',
            name: 'countries',
            display: 'name',
            minLength: 1,
            classNames: {input: 'inputclass'},
            sufficient: 10,
            limit: 5
        };
        vm.options = {
            clear: true
        }
        $scope.$on('typeahead:cursorchange', function (ev, item) {
            $scope.$apply(function () {
                vm.itemonCursorChanged = item[1].name;
            });
        });
        vm.onSelected = function (event, item) {
            $scope.$apply(function () {
                for (var i = vm.itemonSelected.length - 1; i >= 0; i--) {
                    if (vm.itemonSelected[i] === item.name) {
                        vm.itemonSelected.splice(i, 1);
                    }
                }
                vm.itemonSelected.push(item.name);
                vm.itemonCursorChanged = '';
            });
        };
        vm.onClosed = function () {
            $scope.$apply(function () {
                vm.itemonCursorChanged = '';
            });
        };
    }
}());
