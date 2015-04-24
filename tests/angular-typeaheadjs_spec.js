/*jshint -W098 */
'use strict';
describe('angular-typeaheadjs', function () {
    var $compile, $scope, $log, timerCallback, options, EL;

    $.each( $.browser, function( i, val ) {
        console.log(i,':',val);
    });


    options = getOptions();
    EL = getEL();


    beforeEach(module('angularTypeaheadjs'));

    beforeEach(inject([ '$rootScope', '$compile', '$log', function (_rootScope_, _compile_, _log_) {
        $scope = _rootScope_.$new();
        $compile = _compile_;
        $log = _log_;

    }]));

    afterEach(function(){
    });

    describe('Render element', function () {
        function expectations(el) {
            expect(el.localName).toBe('input');
            expect(el.className).toContain('typeahead');
            expect(el.parentNode.localName).toBe('span');
            expect(el.parentNode.className).toContain('twitter-typeahead');
            expect(el.parentNode.childNodes.length).toBe(4);
            expect(el.parentNode.lastChild.localName).toBe('span');
            expect(el.parentNode.lastChild.className).toContain('tt-dropdown-menu');
        }

        function setElement(el, scopeOptions, done, ms) {
            var element = angular.element(el);
            (scopeOptions && ($scope.options = $scope.$eval(scopeOptions)));
            $compile(element)($scope);

            (done && waitsForAndRuns(function() {
                $scope.$digest();
                return false;
            }, function() {
                expectations(element[0]);
                done();
            }, ms || 10));
        }
        [
            {caption: 'should render with just remote options bound to scope', el: EL.addNew(options.remote).tag(), op: EL.scope(), async: false},
            {caption: 'should render with inline remote option', el: EL.addNew(options.remote).inline(), async: false},
            {caption: 'should render with full options bound to scope', el: EL.addNew(options.full()).tag(), op: EL.scope()},
            {caption: 'should render with inline full options', el: EL.addNew(options.full()).inline()},
            {caption:'should render with just prefetch option bound to scope', el:EL.addNew(options.prefetch).tag(), op: EL.scope()},
            {caption:'should render with inline prefetch option', el:EL.addNew(options.prefetch).inline()}
        ].forEach(function (item) {
                var f = !item.async || item.async===true? function (done) {
                    setElement(item.el, item.op, done, item.timeout);
                } : function () {
                    setElement(item.el, item.op);
                };
                it(item.caption, f);
            });

        //        it('teste', function () {
        //            setElement(Tag.new().add(options.remote).tag, Tag.scope());
        //            //setElement(theElement.tag.justOptions,options.justRemote);
        //        });
        //        it('should render with just remote options bound to scope', function () {
        //            setElement(theElement.tag.justOptions, options.justRemote);
        //        });
        //        it('should render with inline remote option', function () {
        //            setElement(theElement.inline.justRemote);
        //        });
        //        it('should render with just prefetch option bound to scope', function () {
        //            setElement(theElement.tag.justOptions, options.justPrefetch);
        //        });
        //        it('should render with inline prefetch option', function () {
        //            setElement(theElement.inline.justPrefetch);
        //        });
    });
    /*describe('Test passing invalid "remote|prefetch" attribute', function () {

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
    });*/
    function getOptions() {
        return {
            remote: {remote: '/tests/integration/%QUERY.json'},
            //prefetch: {prefetch:'/tests/integration/data.json'},
            prefetch: {prefetch: 'http://borntorun.github.io/angular-typeaheadjs/data/countries.json'},
            key: {key: 'name'},
            datasource: {datasource: 'categories'},
            limit: {limit: 2},
            clearvalueFalse: {clearvalue: false},
            clearvalueTrue: {clearvalue: false},
            minlensugestionTwo: {minlensugestion: 3},
            logonwarnFalse: {logonwarn: true},
            logonwarnTrue: {logonwarn: false},
            full: function () {
                return angular.extend({},
                    this.remote,
                    this.prefetch,
                    this.key,
                    this.datasource,
                    this.limit,
                    this.clearvalueFalse,
                    this.clearvalueTrue,
                    this.minlensugestionTwo,
                    this.logonwarnFalse,
                    this.logonwarnTrue);
            }
        };
    }

    function getEL() {
        return {
            options: {},
            TAG: '<angular-typeaheadjs options=\'{{options}}\'/>',
            tag: function () {
                return this.TAG;
            },
            add: function (op) {
                this.options = angular.extend(this.options, op || {});
                return this;
            },
            addNew: function (op) {
                this.options = {};
                return this.add(op);
            },
            inline: function () {
                return this.TAG.replace('{{options}}', this.scope());
            },
            scope: function () {
                return angular.toJson(this.options);
            }
        };
    }

    // This is the equivalent of the old waitsFor/runs syntax
    // which was removed from Jasmine 2
    var waitsForAndRuns = function(escapeFunction, runFunction, escapeTime) {
        // check the escapeFunction every millisecond so as soon as it is met we can escape the function
        var interval = setInterval(function() {
            if (escapeFunction()) {
                clearMe();
                runFunction();
            }
        }, 1);

        // in case we never reach the escapeFunction, we will time out
        // at the escapeTime
        var timeOut = setTimeout(function() {
            clearMe();
            runFunction();
        }, escapeTime);

        // clear the interval and the timeout
        function clearMe(){
            clearInterval(interval);
            clearTimeout(timeOut);
        }
    };
});

