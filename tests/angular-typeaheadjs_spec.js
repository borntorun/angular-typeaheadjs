/*jshint -W098 */
'use strict';
describe('angular-typeaheadjs', function () {
    var $compile, $scope, $log;

    beforeEach(module('angularTypeaheadjs'));
    beforeEach(inject([ '$rootScope', '$compile', '$log', function (_rootScope_, _compile_, _log_) {
        $scope = _rootScope_.$new();
        $compile = _compile_;
        $log = _log_;
    }]));
    describe('Render element', function () {
        it('should render full typeaheadjs structure', function () {
            var element = angular.element('<angular-typeaheadjs remote="{{urlremote}}"/>'), el;
            $scope.urlremote = 'some-url/%QUERY';
            $compile(element)($scope);
            $scope.$digest();
            el = element[0];
            expect(el.localName).toBe('input');
            expect(el.className).toContain('typeahead');
            expect(el.parentNode.localName).toBe('span');
            expect(el.parentNode.className).toContain('twitter-typeahead');
            expect(el.parentNode.childNodes.length).toBe(4);
            expect(el.parentNode.lastChild.localName).toBe('span');
            expect(el.parentNode.lastChild.className).toContain('tt-dropdown-menu');
        });
    });
    describe('Test passing invalid "remote|prefetch" attribute', function () {

        it('should call $log if both attributtes remote|prefetch are not passed', function () {
            spyOn($log, 'error');
            var element = angular.element('<angular-typeaheadjs/>'), el;
            $compile(element)($scope);
            $scope.$digest();
            el = element[0];
            expect(el.attributes.remote).toBeUndefined();
            expect(el.attributes.prefetch).toBeUndefined();
            expect($log.error).toHaveBeenCalledWith('One of attributes [remote|prefetch] is required.([angular-typeaheadjs]:id:' + el.id + ')');
        });
        it('should call $log if both attributtes remote|prefetch are passed as empty strings', function () {
            spyOn($log, 'error');
            var element = angular.element('<angular-typeaheadjs remote="{{remote}}" prefetch="{{prefetch}}"/>'), el;
            $scope.remote = '';
            $scope.prefetch = '';
            $compile(element)($scope);
            $scope.$digest();
            el = element[0];
            expect(el.attributes.remote.nodeValue).toBe('');
            expect(el.attributes.prefetch.nodeValue).toBe('');
            expect($log.error).toHaveBeenCalledWith('One of attributes [remote|prefetch] is required.([angular-typeaheadjs]:id:' + el.id + ')');
        });
        it('should call $log if both attributtes remote|prefetch are passed as undefined', function () {
            spyOn($log, 'error');
            var element = angular.element('<angular-typeaheadjs remote="{{remote}}" prefetch="{{prefetch}}"/>'), el;
            $scope.remote = undefined;
            $scope.prefetch = undefined;
            $compile(element)($scope);
            $scope.$digest();
            el = element[0];
            expect(el.attributes.remote.nodeValue).toBe('');
            expect(el.attributes.prefetch.nodeValue).toBe('');
            expect($log.error).toHaveBeenCalledWith('One of attributes [remote|prefetch] is required.([angular-typeaheadjs]:id:' + el.id + ')');
        });
        it('should call $log if both attributtes remote|prefetch are passed as null', function () {
            spyOn($log, 'error');
            var element = angular.element('<angular-typeaheadjs remote="{{remote}}" prefetch="{{prefetch}}"/>'), el;
            $scope.remote = null;
            $scope.prefetch = null;
            $compile(element)($scope);
            $scope.$digest();
            el = element[0];
            expect(el.attributes.remote.nodeValue).toBe('');
            expect(el.attributes.prefetch.nodeValue).toBe('');
            expect($log.error).toHaveBeenCalledWith('One of attributes [remote|prefetch] is required.([angular-typeaheadjs]:id:' + el.id + ')');
        });
    });

    describe('Test passing "remote and prefetch" attribute:', function () {
        afterEach(function(){
            window.Bloodhound.restore();
        });
        it('Should call Bloodhound and attribute "prefetch" passed to it', function () {
            var spy = sinon.spy(window, 'Bloodhound'),
                element = angular.element('<angular-typeaheadjs prefetch="{{prefetch}}"/>');
            $scope.prefetch = '/tests/integration/data.json';
            $compile(element)($scope);
            $scope.$digest();
            //debugger;
            expect(spy).toHaveBeenCalled();
            expect(spy.args[0][0].prefetch).toBe($scope.prefetch);
        });
        it('Should call Bloodhound and attribute "remote" passed to it', function () {
            var spy = sinon.spy(window, 'Bloodhound'),
                element = angular.element('<angular-typeaheadjs remote="{{remote}}"/>');
            $scope.remote = '/tests/integration/lit.json';
            $compile(element)($scope);
            $scope.$digest();
            expect(spy).toHaveBeenCalled();
            expect(spy.args[0][0].remote).toBe($scope.remote);
        });
    });
    describe('Test attributes',function(){
        it('should have valid attributes', function () {
            var element = angular.element('<angular-typeaheadjs remote="{{remote}}" prefetch="{{prefetch}}" key="{{key}}" datasource="{{datasource}}"' +
                ' clearvalue="{{clearvalue}}" minlensugestion="{{minlensugestion}}"' +
                ' limit="{{limit}}" placeholder="{{placeholder}}" cssinput="{{cssinput}}" />');
            $scope.key = 'name';
            $scope.datasource = 'testitems';
            $scope.clearvalue = 'true';
            $scope.minlensugestion = '2';
            $scope.limit = '3';
            $scope.placeholder = 'insert test';
            $scope.cssinput = 'testcssinput';
            $scope.remote = 'some-url/%QUERY';
            $scope.prefetch = '/tests/integration/data.json';

            $compile(element)($scope);
            $scope.$digest();
            var el = element[0];

            expect(el.attributes.key.nodeValue).toBe($scope.key);
            expect(el.attributes.datasource.nodeValue).toBe($scope.datasource);
            expect(el.attributes.clearvalue.nodeValue).toBe($scope.clearvalue);
            expect(el.attributes.minlensugestion.nodeValue).toBe($scope.minlensugestion);
            expect(el.attributes.limit.nodeValue).toBe($scope.limit);
            expect(el.attributes.placeholder.nodeValue).toBe($scope.placeholder);
            expect(el.attributes.cssinput.nodeValue).toBe($scope.cssinput);
            expect(el.attributes.prefetch.nodeValue).toBe($scope.prefetch);
            expect(el.className).toContain($scope.cssinput);
        });
    });
});
