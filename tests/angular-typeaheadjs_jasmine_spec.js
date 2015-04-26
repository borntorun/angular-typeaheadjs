/*jshint -W098 */
'use strict';

describe('angular-typeaheadjs', function () {
    var $compile, $scope, $log, EL, options, oInjectedForSpies = {};

    console.log('JASMINE');

    EL = getEL();

    /**
     * Get the directive module before each test
     */
    beforeEach(module('angularTypeaheadjs'));
    /**
     * Inject dependencies before each test
     */
    beforeEach(inject(function (_$rootScope_, _$compile_, _$log_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        oInjectedForSpies.$log = _$log_;
    }));

    /**
     * Run the set: compiles the angular element for the test and do assertions
     * @param item
     * @param done
     */
    function runSet(item, done) {

        setSpies(item);

        /**
         * Definitions for element ar set on describes suites bellow
         */
        var element = angular.element(item.tag);

        (item.op && ($scope.options = $scope.$eval(item.op)));

        $compile(element)($scope);

        $scope.$digest();
        /**
         * if need to wait before expects...wait
         */
        waitsForAndRuns(function () {
            return !done;
        }, function () {
            /**
             * call expects
             */
            item.expectations(element[0]);
            done && done();
        }, item.waitms || 10);
    }
    /**
     * Run test (wrapper for it(..)
     * @param item
     */
    function doIt(item) {
        var f = item.wait === undefined || item.wait === true ? function (done) {
            runSet(item, done);
        } : function () {
            runSet(item);
        };
        it(item.caption, f);
    }
    /**
     * Run each suite
     * @param tests
     * @param expectations
     * @param spies
     */
    function doItAll(tests, expectations, spies) {
        tests.forEach(function (item) {
            item.expectations = item.expectations || expectations;
            angular.extend(item, spies || {});
            doIt(item);
        });
    }
    /**
     * Test Suites
     */
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

        //defTestsObject('describe', expectations, sinonsspies);

        doItAll(
            [
                {caption: 'should render with just remote options bound to scope', tag: EL.addNew(EL.attr().remote).tag(), op: EL.scope(), wait: false},
                {caption: 'should render with inline remote option', tag: EL.addNew(EL.attr().remote).inline(), wait: false},
                {caption: 'should render with full options bound to scope', tag: EL.addNew(EL.attr().full()).tag(), op: EL.scope()},
                {caption: 'should render with inline full options', tag: EL.addNew(EL.attr().full()).inline()},
                {caption: 'should render with just prefetch option bound to scope', tag: EL.addNew(EL.attr().prefetch).tag(), op: EL.scope()},
                {caption: 'should render with inline prefetch option', tag: EL.addNew(EL.attr().prefetch).inline()}
            ], expectations);
    });
    describe('Test passing in invalid "remote|prefetch" option', function () {
        var sinonSpies = [
            //here $log dos not exists so just objname is set (obj it will be set from var oInjectedForSpies)
            {objname: '$log', methodname: 'error'}
        ];
        afterEach(function () {
            restoreSpies(sinonSpies);
        });
        function expectations(el) {
            /*jshint validthis:true */
            var log = this.sinonSpySuite[0].spy;
            expect(el.localName).toBe('input');
            expect(el.className).toContain('typeahead');
            expect(el.parentNode.localName).toBe(null);
            expect(log).toHaveBeenCalled();
            expect(log).toHaveBeenCalledWith('One of attributes [remote|prefetch] is required.([angular-typeaheadjs]:id:' + el.id + ')');
        }

        doItAll(
            [
                {caption: 'should call $log.error if both attributtes remote|prefetch are not passed',
                    tag: EL.addNew().tag(), op: EL.scope(), wait: false},
                {caption: 'should call $log.error if both attributtes remote|prefetch are not passed inline',
                    tag: EL.addNew().inline(), wait: false},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed as empty strings',
                    tag: EL.addNew(EL.attr().remoteEmpty).add(EL.attr().prefetchEmpty).tag(), op: EL.scope(), wait: false},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed inline as empty strings',
                    tag: EL.addNew(EL.attr().remoteEmpty).add(EL.attr().prefetchEmpty).inline(), wait: false},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed as empty strings',
                    tag: EL.addNew(EL.attr().remoteUndefined).add(EL.attr().prefetchUndefined).tag(), op: EL.scope(), wait: false},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed inline as empty strings',
                    tag: EL.addNew(EL.attr().remoteUndefined).add(EL.attr().prefetchUndefined).inline(), wait: false},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed as null',
                    tag: EL.addNew(EL.attr().remoteNull).add(EL.attr().prefetchNull).tag(), op: EL.scope(), wait: false},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed inline as null',
                    tag: EL.addNew(EL.attr().remoteNull).add(EL.attr().prefetchNull).inline(), wait: false},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed as not string',
                    tag: EL.addNew(EL.attr().remoteInvalid).add(EL.attr().prefetchInvalid).tag(), op: EL.scope(), wait: false},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed inline as not string',
                    tag: EL.addNew(EL.attr().remoteInvalid).add(EL.attr().prefetchInvalid).inline(), wait: false}
            ], expectations, { sinonSpySuite: sinonSpies}
        );
    });
    describe('Test call to Bloodhound', function () {
        var sinonSpies = [
            {obj: window, methodname: 'Bloodhound'},
            {obj: Bloodhound.prototype, methodname: 'initialize'}
        ];
        afterEach(function () {
            restoreSpies(sinonSpies);
        });
        doItAll(
            [
                {caption: 'Should call Bloodhound with default values',
                    tag: EL.addNew(EL.attr().remote).add(EL.attr().prefetch).tag(), op: EL.scope()},
                {caption: 'Should call Bloodhound with default values inline',
                    tag: EL.addNew(EL.attr().remote).add(EL.attr().prefetch).inline(), op: EL.scope()}
            ], expectations, { sinonSpySuite: sinonSpies}
        );
        function expectations(el) {
            /*jshint validthis:true */
            var bloodhound = this.sinonSpySuite[0].spy,
                bloodhoundargs = bloodhound.args[0][0],
                bloodhoundInitialize = this.sinonSpySuite[1].spy;
            expect(bloodhound).toHaveBeenCalled();
            expect(bloodhoundargs.prefetch).toBe(EL.attr().prefetch.prefetch);
            expect(bloodhoundargs.remote).toBe(EL.attr().remote.remote);
            expect(bloodhoundargs.limit).toBe(25);
            expect(bloodhoundInitialize).toHaveBeenCalled();
        }
    });
    describe('Test call to typeahead', function () {
        var sinonSpies = [
            {obj: $.fn, methodname: 'typeahead'}
        ];
        afterEach(function () {
            restoreSpies(sinonSpies);//window.Bloodhound.restore();
        });
        var expectPassedValues = function (el) {
            /*jshint validthis:true */
            var typeahead = this.sinonSpySuite[0].spy,
                typeaheadargs = typeahead.args[0];
            expect(typeahead).toHaveBeenCalled();
            expect(typeaheadargs[0].minLength).toBe(9);
            expect(typeaheadargs[1].name).toBe('countries');
            expect(typeaheadargs[1].displayKey).toBe('value');
        };
        doItAll(
            [
                {caption: 'Should call typeahead with default values', tag: EL.addNew(EL.attr().remote).tag(), op: EL.scope(), wait: false},
                {caption: 'Should call typeahead with default values inline', tag: EL.addNew(EL.attr().remote).inline(), wait: false},
                {caption: 'Should call typeahead with passed values',
                    tag: EL.addNew(EL.attr().remote).add(EL.attr().datasourceCountries)
                        .add(EL.attr().keyValue).add(EL.attr().minlensugestion9).tag(), op: EL.scope(),
                    expectations: expectPassedValues, wait: false},
                {caption: 'Should call typeahead with passed values inline',
                    tag: EL.addNew(EL.attr().remote).add(EL.attr().datasourceCountries).add(EL.attr().keyValue).add(EL.attr().minlensugestion9).inline(),
                    expectations: expectPassedValues, wait: false}
            ], expectations, { sinonSpySuite: sinonSpies}
        );
        function expectations(el) {
            /*jshint validthis:true */
            var typeahead = this.sinonSpySuite[0].spy,
                typeaheadargs = typeahead.args[0];
            expect(typeahead).toHaveBeenCalled();
            expect(typeaheadargs[0].minLength).toBe(3);
            expect(typeaheadargs[0].highlight).toBe(true);
            expect(typeaheadargs[1].name).toBe('datasource');
            expect(typeaheadargs[1].displayKey).toBe('name');
        }
    });
    describe('Test to model databinding', function () {
        var tag = '<div><input ng-model=\'options.model\'/>$$$</div>';
        doItAll(
            [
                {caption: 'Should update model',
                    tag: tag.replace('$$$',EL.addNew(EL.attr().remote).add(EL.attr().modelWordteste).tag()), op: EL.scope(), wait:false}
            ], expectations
        );
        function expectations(el) {
            expect(el.localName).toBe('div');
            expect(el.children[0].localName).toBe('input');
            expect(el.children[1].localName).toBe('span');
            expect(el.children[1].className).toContain('twitter-typeahead');
            expect(el.children[0].value).toBe('teste');
            $scope.$apply(function() {
                $scope.options.model = 'ok';
            });
            expect(el.children[0].value).toBe('ok');
        }
    });
    /**
     * Maker for tag element
     * @returns {{options: {}, TAG: string, tag: tag, add: add, addNew: addNew, inline: inline, scope: scope, attr: attr}}
     */
    function getEL() {
        var OPT = {
            remote: {remote: '/tests/integration/%QUERY.json'},
            prefetch: {prefetch: 'http://borntorun.github.io/angular-typeaheadjs/data/countries.json'},
            remoteEmpty: {remote: ''},
            prefetchEmpty: {prefetch: ''},
            remoteUndefined: {remote: undefined},
            prefetchUndefined: {prefetch: undefined},
            remoteNull: {remote: null},
            prefetchNull: {prefetch: null},
            remoteInvalid: {remote: 1},
            prefetchInvalid: {prefetch: 1},
            key: {key: 'name'},
            keyValue: {key: 'value'},
            datasourceCountries: {datasource: 'countries'},
            limit: {limit: 2},
            clearvalueFalse: {clearvalue: false},
            clearvalueTrue: {clearvalue: false},
            minlensugestion9: {minlensugestion: 9},
            logonwarnFalse: {logonwarn: true},
            logonwarnTrue: {logonwarn: false},
            modelWordteste: {'model': 'teste'},
            full: function () {
                return angular.extend({},
                    this.remote,
                    this.prefetch,
                    this.key,
                    this.datasource,
                    this.limit,
                    this.clearvalueFalse,
                    this.clearvalueTrue,
                    this.minlensugestion9,
                    this.logonwarnFalse,
                    this.logonwarnTrue);
            }
        };
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
            },
            attr: function() {
                return OPT;
            }
        };
    }

    /**
     * Restore spies
     * @param spies
     */
    function restoreSpies(spies) {
        spies.forEach(function (it) {
            it.spy.restore();
        });
    }

    /**
     * Set spies for test
     * @param item
     */
    function setSpies(item) {
        item.sinonSpySuite && item.sinonSpySuite.forEach(function (it) {
            var o = it.obj || oInjectedForSpies[it.objname];
            if (o) {
                it.spy = sinon.spy(o, it.methodname);
            }
        });
    }
    // This is the equivalent of the old waitsFor/runs syntax
    // which was removed from Jasmine 2
    // Credits: https://gist.github.com/abreckner/110e28897d42126a3bb9
    var waitsForAndRuns = function (escapeFunction, runFunction, escapeTime) {
        if (escapeFunction()) {
            runFunction();
            return;
        }
        // check the escapeFunction every millisecond so as soon as it is met we can escape the function
        var interval = setInterval(function () {
            if (escapeFunction()) {
                clearMe();
                runFunction();
            }
        }, 1);
        // in case we never reach the escapeFunction, we will time out
        // at the escapeTime
        var timeOut = setTimeout(function () {
            clearMe();
            runFunction();
        }, escapeTime);
        // clear the interval and the timeout
        function clearMe() {
            clearInterval(interval);
            clearTimeout(timeOut);
        }
    };
});
