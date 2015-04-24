/*jshint -W098 */
'use strict';
describe('angular-typeaheadjs', function () {
    var $compile, $scope, $log, options, EL;
    //    $.each( $.browser, function( i, val ) {
    //        console.log(i,':',val);
    //    });
    EL = getEL();
    beforeEach(module('angularTypeaheadjs'));
    beforeEach(inject([ '$rootScope', '$compile', '$log', function (_rootScope_, _compile_, _log_) {
        $scope = _rootScope_.$new();
        $compile = _compile_;
        $log = _log_;
    }]));
    afterEach(function () {
    });
    function injectIt(o, name) {
        !o && (inject([ name, function (p) {
            o = p;
        }]));
        return o;
    }
    function restoreSpies(spies) {
        spies.forEach(function (it) {
            it.obj[it.name].restore();
        });
    }

    function setElement(item, done) {
        //console.log(item.spyOnSuite);
        item.spyOnSuite && item.spyOnSuite.forEach(function (it) {
            spyOn(injectIt(it.obj, it.name), it.method);
        });
        item.sinonSpySuite && item.sinonSpySuite.forEach(function (it) {
            it.spy = sinon.spy(it.obj, it.name);
        });
        var element = angular.element(item.tag);
        (item.op && ($scope.options = $scope.$eval(item.op)));
        $compile(element)($scope);
        (done && waitsForAndRuns(function () {
            $scope.$digest();
            return false;
        }, function () {
            item.expectations(element[0]);
            done();
        }, item.ms || 1));
    }

    function doIt(item) {
        //console.log(item);
        var f = !item.async || item.async === true ? function (done) {
            setElement(item, done);
        } : function () {
            setElement(item);
        };
        it(item.caption, f);
    }

    function doItAll(tests, expectations, spies) {
        tests.forEach(function (item) {
            item.expectations = item.expectations || expectations;
            angular.extend(item, spies || {});
            //item.spyOnSuite = spies || undefined;
            doIt(item);
        });
    }

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
        doItAll(
            [
                {caption: 'should render with just remote options bound to scope', tag: EL.addNew(EL.attr.remote).tag(), op: EL.scope(), async: false},
                {caption: 'should render with inline remote option', tag: EL.addNew(EL.attr.remote).inline(), async: false},
                {caption: 'should render with full options bound to scope', tag: EL.addNew(EL.attr.full()).tag(), op: EL.scope()},
                {caption: 'should render with inline full options', tag: EL.addNew(EL.attr.full()).inline()},
                {caption: 'should render with just prefetch option bound to scope', tag: EL.addNew(EL.attr.prefetch).tag(), op: EL.scope()},
                {caption: 'should render with inline prefetch option', tag: EL.addNew(EL.attr.prefetch).inline()}
            ], expectations);
    });

    describe('Test passing in invalid "remote|prefetch" option', function () {
        function expectations(el) {
            expect(el.localName).toBe('input');
            expect(el.className).toContain('typeahead');
            expect(el.parentNode.localName).toBe(null);
            expect($log.error).toHaveBeenCalledWith('One of attributes [remote|prefetch] is required.([angular-typeaheadjs]:id:' + el.id + ')');
        }
        doItAll(
            [
                {caption: 'should call $log.error if both attributtes remote|prefetch are not passed',
                    tag: EL.addNew().tag(), op: EL.scope(), async: false},
                {caption: 'should call $log.error if both attributtes remote|prefetch are not passed inline',
                    tag: EL.addNew().inline(), async: false},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed as empty strings',
                    tag: EL.addNew(EL.attr.remoteEmpty).add(EL.attr.prefetchEmpty).tag(), op: EL.scope()},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed inline as empty strings',
                    tag: EL.addNew(EL.attr.remoteEmpty).add(EL.attr.prefetchEmpty).inline()},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed as empty strings',
                    tag: EL.addNew(EL.attr.remoteUndefined).add(EL.attr.prefetchUndefined).tag(), op: EL.scope()},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed inline as empty strings',
                    tag: EL.addNew(EL.attr.remoteUndefined).add(EL.attr.prefetchUndefined).inline()},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed as null',
                    tag: EL.addNew(EL.attr.remoteNull).add(EL.attr.prefetchNull).tag(), op: EL.scope()},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed inline as null',
                    tag: EL.addNew(EL.attr.remoteNull).add(EL.attr.prefetchNull).inline()},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed as not string',
                    tag: EL.addNew(EL.attr.remoteInvalid).add(EL.attr.prefetchInvalid).tag(), op: EL.scope()},
                {caption: 'should call $log.error if both attributtes remote|prefetch are passed inline as not string',
                    tag: EL.addNew(EL.attr.remoteInvalid).add(EL.attr.prefetchInvalid).inline()}
            ], expectations, { spyOnSuite: [
                {obj: $log, name: '$log', method: 'error'}
            ]}
        );
    });

    describe('Test call to Bloodhound', function () {
        var sinonSpies = [
            {obj: window, name: 'Bloodhound'},
            {obj: Bloodhound.prototype, name: 'initialize'}
        ];
        afterEach(function () {
            restoreSpies(sinonSpies);//window.Bloodhound.restore();
        });
        doItAll(
            [
                {caption: 'Should call Bloodhound with default values',
                    tag: EL.addNew(EL.attr.remote).add(EL.attr.prefetch).tag(), op: EL.scope()}
            ], expectations, { sinonSpySuite: sinonSpies}
        );

        function expectations(el) {
            /*jshint validthis:true */
            var bloodhound = this.sinonSpySuite[0].spy,
                bloodhoundargs = bloodhound.args[0][0],
                bloodhoundInitialize = this.sinonSpySuite[1].spy;
            expect(bloodhound).toHaveBeenCalled();
            expect(bloodhoundargs.prefetch).toBe(EL.attr.prefetch.prefetch);
            expect(bloodhoundargs.remote).toBe(EL.attr.remote.remote);
            expect(bloodhoundargs.limit).toBe(25);
            expect(bloodhoundInitialize).toHaveBeenCalled();
        }

    });

    describe('Test call to typeahead', function () {
        var sinonSpies = [
            {obj: $.fn, name: 'typeahead'}
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
                {caption: 'Should call typeahead with default values',
                    tag: EL.addNew(EL.attr.remote).tag(), op: EL.scope()},
                {caption: 'Should call typeahead with default values inline',
                    tag: EL.addNew(EL.attr.remote).inline()},
                {caption: 'Should call typeahead with passed values',
                    tag: EL.addNew(EL.attr.remote).add(EL.attr.datasourceCountries).add(EL.attr.keyValue).add(EL.attr.minlensugestion9).tag(), op: EL.scope(),
                    expectations: expectPassedValues},
                {caption: 'Should call typeahead with passed values inline',
                    tag: EL.addNew(EL.attr.remote).add(EL.attr.datasourceCountries).add(EL.attr.keyValue).add(EL.attr.minlensugestion9).inline(),
                    expectations: expectPassedValues}
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
            attr: OPT
        };
    }

    // This is the equivalent of the old waitsFor/runs syntax
    // which was removed from Jasmine 2
    // Credits: https://gist.github.com/abreckner/110e28897d42126a3bb9
    var waitsForAndRuns = function (escapeFunction, runFunction, escapeTime) {
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

