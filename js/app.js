(function () {
    'use strict';
    angular.module('appdemo', ['angularTypeaheadjs'])
        .controller('RemotePrefetchCtrl', [ '$scope', RemotePrefetchCtrl ])
        .controller('BasicsCtrl', [ '$scope', BasicsCtrl ]);
    function BasicsCtrl($scope) {
        var vm = this;
        vm.itemonSelected = '';
        vm.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
            'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
            'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
            'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
            'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
            'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
            'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
            'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
            'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
        ];
        var substringMatcher = function(strs) {
            return function findMatches(q, cb) {
                var matches, substrRegex;
                // an array that will be populated with substring matches
                matches = [];
                // regex used to determine if a string contains the substring `q`
                substrRegex = new RegExp(q, 'i');
                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                $.each(strs, function(i, str) {
                    if (substrRegex.test(str)) {
                        matches.push(str);
                    }
                });
                cb(matches);
            };
        };
        vm.ttoptions = {
            minLength: 1
        };
        vm.options = {
            selectOnAutocomplete: true
        };
        vm.datasets = [{
            name: 'states',
            source: substringMatcher(vm.states)
        }];
        $scope.$on('typeahead:select', function (ev, item) {
            $scope.$apply(function () {
                vm.itemonSelected = item[1];
            });
        });
    }
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
