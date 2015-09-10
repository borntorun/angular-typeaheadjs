/*jshint -W098 */
'use strict';
describe('angular-typeaheadjs', function() {
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
  beforeEach(inject(function( _$rootScope_, _$compile_, _$log_ ) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    oInjectedForSpies.$log = _$log_;
  }));

  /**
   * Run the set: compiles the angular element for the test and do assertions
   * @param item
   * @param done
   */
  function runSet( item, done ) {
    setSpies(item);

    /**
     * Definitions for element ar set on describes suites bellow
     */
    //console.log(item.tag);
    var element = angular.element(item.tag);
    (item.options && ($scope.options = $scope.$eval(item.options)));
    (item.ttoptions && ($scope.ttoptions = $scope.$eval(item.ttoptions)));
    (item.ttdatasets && ($scope.ttdatasets = $scope.$eval(item.ttdatasets)));
    (item.bhfunctions && ($scope.bhfunctions = $scope.$eval(item.bhfunctions)));

    $compile(element)($scope);
    $scope.$digest();
    /**
     * if need to wait before expects...wait
     */
    waitsForAndRuns(function() {
      return !done;
    }, function() {
      /**
       * call expects
       */
      item.expectations(element);
      done && done();
    }, item.waitms || 50);
  }

  /**
   * Run test (wrapper for it(..)
   * @param item
   */
  function doIt( item ) {
    var f = item.wait === undefined || item.wait === true ? function( done ) {
      runSet(item, done);
    } : function() {
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
  function doItAll( tests, expectations, spies ) {
    tests.forEach(function( item ) {
      item.expectations = item.expectations || expectations;
      angular.extend(item, spies || {});
      doIt(item);
    });
  }

  /**
   * Test Suites
   */
  describe('Render element', function() {
    doItAll(
      [
        {caption: 'should render with just remote option bound to scope',
          tag: EL.addNewTTOpt(EL.opt.remote).tag(), ttoptions: EL.scopeTTOptions()},
        {caption: 'should render with just prefetch option bound to scope',
          tag: EL.addNewTTOpt(EL.opt.prefetch).tag(), ttoptions: EL.scopeTTOptions()},
        {caption: 'should render with tag as attribute - just remote option bound to scope',
          tag: EL.addNewTTOpt(EL.opt.remote).tagAttr(), ttoptions: EL.scopeTTOptions()},
        {caption: 'should render with tag as class - just remote option bound to scope',
          tag: EL.addNewTTOpt(EL.opt.remote).tagClass(), ttoptions: EL.scopeTTOptions()}
      ], expectations);
    function expectations( el ) {
      //debugger;
      //console.log(el);
      expect(el.find('span.twitter-typeahead').length).toBe(1);
      expect(el.find('span.twitter-typeahead > input.typeahead.tt-hint').length).toBe(1);
      expect(el.find('span.twitter-typeahead > input.typeahead.tt-input').length).toBe(1);
      expect(el.find('span.twitter-typeahead')[0].childNodes.length).toBe(4);
      expect(el.find('span.twitter-typeahead')[0].lastChild.localName).toBe('div');
      expect(el.find('span.twitter-typeahead')[0].lastChild.className).toContain('tt-menu');
    }
  });
  describe('Test on log passing in invalid prameters', function() {
    var sinonSpies = [
      //here $log dos not exists so just objname is set (obj it will be set from var oInjectedForSpies)
      {objname: '$log', methodname: 'error'}
    ];
    afterEach(function() {
      restoreSpies(sinonSpies);
    });
    doItAll(
      [
        {caption: 'should call $log.error if datasets is not an array',
          tag: EL.addNewTTOpt().addOpt(EL.opt.showLogTrue).useDatasetsInvalid()
            .tag(), options: EL.scopeOptions(), ttoptions: EL.scopeTTOptions(), ttdatasets: EL.scopeTTdatasets(), expectations: expectationsDatasets},
        {caption: 'should call $log.error if both attributtes remote|prefetch are not passed',
          tag: EL.addNewTTOpt().addOpt(EL.opt.showLogTrue)
            .tag(), options: EL.scopeOptions(), ttoptions: EL.scopeTTOptions()},
        {caption: 'should call $log.error if both attributtes remote|prefetch are passed as empty strings',
          tag: EL.addNewTTOpt(EL.opt.remoteEmpty).addTTOpt(EL.opt.prefetchEmpty).addOpt(EL.opt.showLogTrue)
            .tag(), options: EL.scopeOptions(), ttoptions: EL.scopeTTOptions()},
        {caption: 'should call $log.error if both attributtes remote|prefetch are passed as empty strings',
          tag: EL.addNewTTOpt(EL.opt.remoteUndefined).addTTOpt(EL.opt.prefetchUndefined).addOpt(EL.opt.showLogTrue)
            .tag(), options: EL.scopeOptions(), ttoptions: EL.scopeTTOptions()},
        {caption: 'should call $log.error if both attributtes remote|prefetch are passed as null',
          tag: EL.addNewTTOpt(EL.opt.remoteNull).addTTOpt(EL.opt.prefetchNull).addOpt(EL.opt.showLogTrue)
            .tag(), options: EL.scopeOptions(), ttoptions: EL.scopeTTOptions()},
        {caption: 'should call $log.error if both attributtes remote|prefetch are passed as not string',
          tag: EL.addNewTTOpt(EL.opt.remoteInvalid).addTTOpt(EL.opt.prefetchInvalid).addOpt(EL.opt.showLogTrue)
            .tag(), options: EL.scopeOptions(), ttoptions: EL.scopeTTOptions()}
      ], expectations, { sinonSpySuite: sinonSpies}
    );
    function expectationsDatasets( el ) {
      /* jshint validthis:true */
      var log = this.sinonSpySuite[0].spy;
      expect(log).toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith('angty-ttdatasets must be an array.([angular-typeaheadjs]:id:' + EL.id + ')');
    }

    function expectations( el ) {
      /* jshint validthis:true */
      var log = this.sinonSpySuite[0].spy;
      expect(log).toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith('One of attributes [remote|prefetch] is required.([angular-typeaheadjs]:id:' + EL.id + ')');
    }
  });
  describe('Test call to Bloodhound', function() {
    var sinonSpies = [
      {obj: window, methodname: 'Bloodhound'},
      {obj: Bloodhound.prototype, methodname: 'initialize'}
    ];
    afterEach(function() {
      restoreSpies(sinonSpies);
    });
    var expectPassedValues = function( el ) {
        /*jshint validthis:true*/
        var bloodhound = this.sinonSpySuite[0].spy,
          bloodhoundargs = bloodhound.args[0][0],
          bloodhoundInitialize = this.sinonSpySuite[1].spy;
        expect(bloodhound).toHaveBeenCalled();
        expect(bloodhoundargs.prefetch).toBe(EL.opt.prefetch.prefetch);
        expect(bloodhoundargs.remote).toEqual(EL.opt.remoteObj);
        expect(bloodhoundargs.sufficient).toBe(EL.opt.sufficientFive.sufficient);
        expect(bloodhoundInitialize).toHaveBeenCalled();
      },
      expectBHDefaultValues = function( el ) {
        /*jshint validthis:true*/
        var bloodhound = this.sinonSpySuite[0].spy,
          bloodhoundargs = bloodhound.args[0][0],
          bloodhoundInitialize = this.sinonSpySuite[1].spy;
        expect(bloodhound).toHaveBeenCalled();
        expect(bloodhoundargs.prefetch).toBe(EL.opt.prefetch.prefetch);
        expect(bloodhoundargs.remote).toEqual(EL.opt.remoteObj);
        expect(bloodhoundargs.sufficient).toBeUndefined();
        expect(bloodhoundInitialize).toHaveBeenCalled();
      };
    doItAll(
      [
        {caption: 'Should call Bloodhound with default values',
          tag: EL.addNewTTOpt(EL.opt.remote).addTTOpt(EL.opt.prefetch)
            .tag(), ttoptions: EL.scopeTTOptions()},
        {caption: 'Should call Bloodhound with arg sufficient=5',
          tag: EL.addNewTTOpt(EL.opt.remote).addTTOpt(EL.opt.prefetch).addTTOpt(EL.opt.sufficientFive)
            .tag(),
          ttoptions: EL.scopeTTOptions(), expectations: expectPassedValues},
        {caption: 'Should call Bloodhound with Bloodhound default values',
          tag: EL.addNewTTOpt(EL.opt.remote).addTTOpt(EL.opt.prefetch).addOpt(EL.opt.useOwnDefaultsFalse)
            .tag(),
          ttoptions: EL.scopeTTOptions(),
          options: EL.scopeOptions(),
          expectations: expectBHDefaultValues
        },
        {caption: 'Passing bhfunctions should call Bloodhound with default values',
          tag: EL.addNewTTOpt(EL.opt.remote)
            .addTTOpt(EL.opt.prefetch)
            .useBhfunctions()
            .tag(),
          ttoptions: EL.scopeTTOptions(),
          bhfunctions: EL.scopeBHfunctions()
        }
      ], expectations, { sinonSpySuite: sinonSpies}
    );
    function expectations( el ) {
      /*jshint validthis:true*/
      var bloodhound = this.sinonSpySuite[0].spy,
        bloodhoundargs = bloodhound.args[0][0],
        bloodhoundInitialize = this.sinonSpySuite[1].spy;
      expect(bloodhound).toHaveBeenCalled();
      expect(bloodhoundargs.prefetch).toBe(EL.opt.prefetch.prefetch);
      expect(bloodhoundargs.remote).toEqual(EL.opt.remoteObj);
      expect(bloodhoundargs.sufficient).toBe(10);
      expect(bloodhoundInitialize).toHaveBeenCalled();
    }
  });
  describe('Test call to typeahead', function() {
    var sinonSpies = [
      {obj: $.fn, methodname: 'typeahead'}
    ];
    afterEach(function() {
      restoreSpies(sinonSpies);//window.Bloodhound.restore();
    });
    var expectPassedValues = function( el ) {
        /*jshint validthis:true*/
        var typeahead = this.sinonSpySuite[0].spy,
          typeaheadargs = typeahead.args[0];
        expect(typeahead).toHaveBeenCalled();
        expect(typeaheadargs[0].hint).toBe(EL.opt.hintFalse.hint);
        expect(typeaheadargs[0].highlight).toBe(EL.opt.highlightFalse.highlight);
        expect(typeaheadargs[0].minLength).toBe(EL.opt.minLengthZero.minLength);
        expect(typeaheadargs[0].classNames).toEqual(EL.opt.classNamesMy.classNames);
        expect(typeaheadargs[1].display).toBe(EL.opt.displayValue.display);
        expect(typeaheadargs[1].name).toBe(EL.opt.nameCountries.name);
      },
      expectTTDefaultValues = function( el ) {
        /*jshint validthis:true*/
        var typeahead = this.sinonSpySuite[0].spy,
          typeaheadargs = typeahead.args[0];
        expect(typeahead).toHaveBeenCalled();
        expect(typeaheadargs[0].hint).toBeUndefined();
        expect(typeaheadargs[0].highlight).toBeUndefined();
        expect(typeaheadargs[0].minLength).toBeUndefined();
        expect(typeaheadargs[0].classNames).toBeUndefined();
        expect(typeaheadargs[0]).toEqual({});
        expect(typeaheadargs[1].display).toBeUndefined();
        expect(typeaheadargs[1].name).toBeUndefined();
      };
    doItAll(
      [
        {caption: 'Should call typeahead with default values',
          tag: EL.addNewTTOpt(EL.opt.remote)
            .tag(), ttoptions: EL.scopeTTOptions()},
        {caption: 'Should call typeahead with passed values',
          tag: EL.addNewTTOpt(EL.opt.remote).addTTOpt(EL.opt.hintFalse).addTTOpt(EL.opt.highlightFalse)
            .addTTOpt(EL.opt.minLengthZero).addTTOpt(EL.opt.classNamesMy).addTTOpt(EL.opt.displayValue)
            .addTTOpt(EL.opt.nameCountries)
            .tag(),
          ttoptions: EL.scopeTTOptions(),
          expectations: expectPassedValues},
        {caption: 'Should call typeahead with typeahead default values',
          tag: EL.addNewTTOpt(EL.opt.remote).addTTOpt(EL.opt.prefetch).addOpt(EL.opt.useOwnDefaultsFalse)
            .tag(),
          ttoptions: EL.scopeTTOptions(),
          options: EL.scopeOptions(),
          expectations: expectTTDefaultValues
        }
      ], expectations, { sinonSpySuite: sinonSpies}
    );
    function expectations( el ) {
      /*jshint validthis:true*/
      var typeahead = this.sinonSpySuite[0].spy,
        typeaheadargs = typeahead.args[0];
      expect(typeahead).toHaveBeenCalled();
      expect(typeaheadargs[0].hint).toBe(EL.opt.hint.hint);
      expect(typeaheadargs[0].highlight).toBe(EL.opt.highlight.highlight);
      expect(typeaheadargs[0].minLength).toBe(EL.opt.minLength.minLength);
      expect(typeaheadargs[0].classNames).toBe(EL.opt.classNames.classNames);
      expect(typeaheadargs[1].display).toBe(EL.opt.display.display);
      expect(typeaheadargs[1].name).toBeUndefined();
    }
  });
  describe('Test sending multiple datasets', function() {
    var sinonSpies = [
      {obj: $.fn, methodname: 'typeahead'}
    ];
    afterEach(function() {
      restoreSpies(sinonSpies);
    });
    function expectTTDefaultValues( el ) {
      /*jshint validthis:true*/
      var typeahead = this.sinonSpySuite[0].spy,
        typeaheadargs = typeahead.args[0];
      //console.log(typeaheadargs[1][0]);
      expect(typeahead).toHaveBeenCalled();
      expect(typeaheadargs[0].hint).toBeUndefined();
      expect(typeaheadargs[0].highlight).toBeUndefined();
      expect(typeaheadargs[0].minLength).toBeUndefined();
      expect(typeaheadargs[0].classNames).toBeUndefined();
      expect(typeaheadargs[0]).toEqual({});
      expect(typeaheadargs[1][0].display).toBe(EL.opt.displayTeam.display);
      expect(typeaheadargs[1][0].name).toBe(EL.opt.nameNBATeams.name);
      expect(typeaheadargs[1][0].display).toBe(EL.opt.displayTeam.display);
      expect(typeaheadargs[1][0].name).toBe(EL.opt.nameNBATeams.name);
      expect(typeaheadargs[1][1].display).toBe(EL.opt.displayTeam.display);
      expect(typeaheadargs[1][1].name).toBe(EL.opt.nameNHLTeams.name);
      expect(typeaheadargs[1][1].display).toBe(EL.opt.displayTeam.display);
      expect(typeaheadargs[1][1].name).toBe(EL.opt.nameNHLTeams.name);
    }

    function expectTTPassedValues( el ) {
      /*jshint validthis:true*/
      var typeahead = this.sinonSpySuite[0].spy,
        typeaheadargs = typeahead.args[0];
      //console.log(typeaheadargs[1][0]);
      expect(typeahead).toHaveBeenCalled();
      expect(typeaheadargs[0].hint).toBe(EL.opt.hintFalse.hint);
      expect(typeaheadargs[0].highlight).toBe(EL.opt.highlightTrue.highlight);
      expect(typeaheadargs[0].minLength).toBe(EL.opt.minLengthZero.minLength);
      expect(typeaheadargs[0].classNames).toEqual(EL.opt.classNamesMy.classNames);
      expect(typeaheadargs[1][0].display).toBe(EL.opt.displayTeam.display);
      expect(typeaheadargs[1][0].name).toBe(EL.opt.nameNBATeams.name);
      expect(typeaheadargs[1][0].display).toBe(EL.opt.displayTeam.display);
      expect(typeaheadargs[1][0].name).toBe(EL.opt.nameNBATeams.name);
      expect(typeaheadargs[1][1].display).toBe(EL.opt.displayTeam.display);
      expect(typeaheadargs[1][1].name).toBe(EL.opt.nameNHLTeams.name);
      expect(typeaheadargs[1][1].display).toBe(EL.opt.displayTeam.display);
      expect(typeaheadargs[1][1].name).toBe(EL.opt.nameNHLTeams.name);
    }

    doItAll(
      [
        {caption: 'Should call typeahead with default values',
          tag: EL.addNewTTOpt().useDatasets().tag(),
          ttdatasets: EL.scopeTTdatasets()},
        {caption: 'Should call typeahead with values passed in',
          tag: EL.addNewTTOpt(EL.opt.hintFalse).addTTOpt(EL.opt.highlightTrue).addTTOpt(EL.opt.minLengthZero)
            .addTTOpt(EL.opt.classNamesMy)
            .useDatasets()
            .tag(),
          ttoptions: EL.scopeTTOptions(),
          ttdatasets: EL.scopeTTdatasets(), expectations: expectTTPassedValues},
        {caption: 'Should call typeahead with typeahead default values',
          tag: EL.addNewOpt(EL.opt.useOwnDefaultsFalse)
            .useDatasets()
            .tag(),
          options: EL.scopeOptions(),
          ttdatasets: EL.scopeTTdatasets(), expectations: expectTTDefaultValues}
      ], expectations, { sinonSpySuite: sinonSpies}
    );
    function expectations( el ) {
      /*jshint validthis:true*/
      var typeahead = this.sinonSpySuite[0].spy,
        typeaheadargs = typeahead.args[0];
      expect(typeahead).toHaveBeenCalled();
      expect(typeaheadargs[0].hint).toBe(EL.opt.hint.hint);
      expect(typeaheadargs[0].highlight).toBe(EL.opt.highlight.highlight);
      expect(typeaheadargs[0].minLength).toBe(EL.opt.minLength.minLength);
      expect(typeaheadargs[0].classNames).toBeUndefined();
      expect(typeaheadargs[1][0].display).toBe(EL.opt.displayTeam.display);
      expect(typeaheadargs[1][0].name).toBe(EL.opt.nameNBATeams.name);
      expect(typeaheadargs[1][0].display).toBe(EL.opt.displayTeam.display);
      expect(typeaheadargs[1][0].name).toBe(EL.opt.nameNBATeams.name);
      expect(typeaheadargs[1][1].display).toBe(EL.opt.displayTeam.display);
      expect(typeaheadargs[1][1].name).toBe(EL.opt.nameNHLTeams.name);
      expect(typeaheadargs[1][1].display).toBe(EL.opt.displayTeam.display);
      expect(typeaheadargs[1][1].name).toBe(EL.opt.nameNHLTeams.name);
    }
  });

  /**
   * Maker for tag element
   * @returns {{opt: {remoteObj: {url: string, wildcard: string}, remote: {remote: string}, prefetchData: {prefetch: string}, prefetch: {prefetch: string}, remoteEmpty: {remote: string}, prefetchEmpty: {prefetch: string}, remoteUndefined: {remote: undefined}, prefetchUndefined: {prefetch: undefined}, remoteNull: {remote: null}, prefetchNull: {prefetch: null}, remoteInvalid: {remote: number}, prefetchInvalid: {prefetch: number}, datasetsNotArray: {keyI: string}, sufficientFive: {sufficient: number}, name: {name: string}, nameCountries: {name: string}, nameNBATeams: {name: string}, nameNHLTeams: {name: string}, limitFive: {limit: number}, displayValue: {display: string}, display: {display: string}, displayTeam: {display: string}, highlight: {highlight: boolean}, hint: {hint: boolean}, minLength: {minLength: number}, classNames: {classNames: undefined}, highlightFalse: {highlight: boolean}, highlightTrue: {highlight: boolean}, hintFalse: {hint: boolean}, hintTrue: {hint: boolean}, minLengthZero: {minLength: number}, minLengthTwo: {minLength: number}, classNamesMy: {classNames: {wrapper: string, input: string, hint: string, menu: string, dataset: string, suggestion: string, selectable: string, empty: string, open: string, cursor: string, highlight: string}}, useOwnDefaultsFalse: {useOwnDefaults: boolean}, useOwnDefaultsTrue: {useOwnDefaults: boolean}, selectOnAutocompleteFalse: {selectOnAutocomplete: boolean}, selectOnAutocompleteTrue: {selectOnAutocomplete: boolean}, clearFalse: {clear: boolean}, clearTrue: {clear: boolean}, emitOnlyIfPresentFalse: {emitOnlyIfPresent: boolean}, emitOnlyIfPresentTrue: {emitOnlyIfPresent: boolean}, showLogFalse: {showLog: boolean}, showLogTrue: {showLog: boolean}}, id: string, options: undefined, ttoptions: undefined, ttdatasets: undefined, clear: clear, tag: tag, scopeOptions: scopeOptions, scopeTTOptions: scopeTTOptions, scopeTTdatasets: scopeTTdatasets, addNewOpt: addNewOpt, addOpt: addOpt, addNewTTOpt: addNewTTOpt, addTTOpt: addTTOpt, useDatasets: useDatasets, useDatasetsInvalid: useDatasetsInvalid}}
   */
  function getEL() {
    var OPT = {
        remoteObj: { url: '/tests/assets/%QUERY.json', wildcard: '%QUERY' },
        remote: {remote: '/tests/assets/%QUERY.json'},
        prefetchData: {prefetch: 'http://borntorun.github.io/angular-typeaheadjs/data/countries.json'},
        prefetch: {prefetch: '/base/tests/assets/data.json'},
        remoteEmpty: {remote: ''},
        prefetchEmpty: {prefetch: ''},
        remoteUndefined: {remote: undefined},
        prefetchUndefined: {prefetch: undefined},
        remoteNull: {remote: null},
        prefetchNull: {prefetch: null},
        remoteInvalid: {remote: 1},
        prefetchInvalid: {prefetch: 1},
        datasetsNotArray: { 'keyI': 'im not an array' },
        sufficientFive: {sufficient: 5},
        name: {name: 'datasource'},
        nameCountries: {name: 'countries'},
        nameNBATeams: {name: 'nba-teams'},
        nameNHLTeams: {name: 'nhl-teams'},
        limitFive: {limit: 5},
        displayValue: {display: 'value'},
        display: {display: 'name'},
        displayTeam: {display: 'team'},
        highlight: {highlight: true},
        hint: {hint: true},
        minLength: {minLength: 3},
        classNames: {classNames: undefined},
        highlightFalse: {highlight: false},
        highlightTrue: {highlight: true},
        hintFalse: {hint: false},
        hintTrue: {hint: true},
        minLengthZero: {minLength: 0},
        minLengthTwo: {minLength: 2},
        classNamesMy: {
          classNames: {
            wrapper: 'my-twitter-typeahead',
            input: 'my-tt-input',
            hint: 'my-tt-hint',
            menu: 'my-tt-menu',
            dataset: 'my-tt-dataset',
            suggestion: 'my-tt-suggestion',
            selectable: 'my-tt-selectable',
            empty: 'my-tt-empty',
            open: 'my-tt-open',
            cursor: 'my-tt-cursor',
            highlight: 'my-tt-highlight'
          }

        },
        useOwnDefaultsFalse: {useOwnDefaults: false},
        useOwnDefaultsTrue: {useOwnDefaults: true},
        selectOnAutocompleteFalse: {selectOnAutocomplete: false},
        selectOnAutocompleteTrue: {selectOnAutocomplete: true},
        clearFalse: {clear: false},
        clearTrue: {clear: false},
        emitOnlyIfPresentFalse: {emitOnlyIfPresent: true},
        emitOnlyIfPresentTrue: {emitOnlyIfPresent: false},
        showLogFalse: {showLog: false},
        showLogTrue: {showLog: true},
        watchInitEventTrue: {watchInitEvent: true},
        watchInitEventFalse: {watchInitEvent: false},
        watchSetValEventTrue: {watchSetValEventTrue: true},
        watchSetValEventFalse: {watchInitEvent: false}
      },
      IDTEST = 'idtest',
      OPTIONS = ' angty-options=\'{{options}}\'',
      TTOPTIONS = ' angty-ttoptions=\'{{ttoptions}}\'',
      TTDATASETS = ' angty-ttdatasets=\'ttdatasets\'',
      BHFUNCTIONS = ' angtyBhfunctions=\'ttbhfunctions\'',
      TAG = '<angular-typeaheadjs $options$$ttoptions$$ttdatasets$$ttbhfunctions$>' +
        '<input class="typeahead" type="text" placeholder="filter..." id="$IDTEST$"/>' +
        '</angular-typeaheadjs>',
      TAGATTR = '<span angular-typeaheadjs $options$$ttoptions$$ttdatasets$$ttbhfunctions$>' +
      '<input class="typeahead" type="text" placeholder="filter..." id="$IDTEST$"/>' +
      '</span>',
      TAGCLASS = '<span class="angular-typeaheadjs" $options$$ttoptions$$ttdatasets$$ttbhfunctions$>' +
        '<input class="typeahead" type="text" placeholder="filter..." id="$IDTEST$"/>' +
        '</span>';

    function setBhfunctionsInvalid() {
      return {identify: 'not a function'};
    }

    function setDatasetsInvalid() {
      return {'key': 'not an array'};
    }

    function setDatasets() {
      var ods = [
        {
          name: 'nba-teams',
          display: 'team',
          source: new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('team'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: '/base/tests/assets/nba.json'
          }),
          templates: {
            header: '<h3 class="league-name">NBA Teams</h3>'
          }
        },
        {
          name: 'nhl-teams',
          display: 'team',
          source: new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('team'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: '/base/tests/assets/nhl.json'
          }),
          templates: {
            header: '<h3 class="league-name">NHL Teams</h3>'
          }
        }
      ];
      return ods;
    }

    function setBhFunctions() {
      return {
        identify: function( obj ) {
          return 'hello';
        }
      };
    }

    function add( options, op ) {
      return angular.extend(options || {}, op || {});
    }

    return {
      opt: OPT,
      id: IDTEST,
      options: undefined,
      ttoptions: undefined,
      ttdatasets: undefined,
      bhfunctions: undefined,
      clear: function() {
        this.options = this.ttoptions = this.ttdatasets = this.bhfunctions = undefined;
      },
      tagAttr: function() {
        return TAGATTR.replace('$options$', this.options ? OPTIONS : '')
          .replace('$ttoptions$', this.ttoptions ? TTOPTIONS : '')
          .replace('$ttdatasets$', this.ttdatasets ? TTDATASETS : '')
          .replace('$ttbhfunctions$', this.bhfunctions ? BHFUNCTIONS : '')
          .replace('$IDTEST$', IDTEST);
      },
      tagClass: function() {
        return TAGCLASS.replace('$options$', this.options ? OPTIONS : '')
          .replace('$ttoptions$', this.ttoptions ? TTOPTIONS : '')
          .replace('$ttdatasets$', this.ttdatasets ? TTDATASETS : '')
          .replace('$ttbhfunctions$', this.bhfunctions ? BHFUNCTIONS : '')
          .replace('$IDTEST$', IDTEST);
      },
      tag: function() {
        return TAG.replace('$options$', this.options ? OPTIONS : '')
          .replace('$ttoptions$', this.ttoptions ? TTOPTIONS : '')
          .replace('$ttdatasets$', this.ttdatasets ? TTDATASETS : '')
          .replace('$ttbhfunctions$', this.bhfunctions ? BHFUNCTIONS : '')
          .replace('$IDTEST$', IDTEST);
      },
      /*inline: function () {
          return this.tag()
              .replace('{{options}}', this.scopeOptions())
              .replace('{{ttoptions}}', this.scopeTTOptions());
      },*/
      scopeOptions: function() {
        return angular.toJson(this.options);
      },
      scopeTTOptions: function() {
        return angular.toJson(this.ttoptions);
      },
      scopeTTdatasets: function() {
        return angular.toJson(this.ttdatasets);
      },
      scopeBHfunctions: function() {
        return angular.toJson(this.bhfunctions);
      },
      addNewOpt: function( op ) {
        this.clear();
        return this.addOpt(op);
      },
      addOpt: function( op ) {
        this.options = add(this.options, op);
        return this;
      },
      addNewTTOpt: function( op ) {
        this.clear();
        return this.addTTOpt(op);
      },
      addTTOpt: function( op ) {
        this.ttoptions = add(this.ttoptions, op);
        return this;
      },
      useDatasets: function() {
        this.ttdatasets = setDatasets();
        return this;
      },
      useBhfunctions: function() {
        this.bhfunctions = setBhFunctions();
        return this;
      },
      useDatasetsInvalid: function() {
        this.ttdatasets = setDatasetsInvalid();
        return this;
      }

    };
  }

  /**
   * Restore spies
   * @param spies
   */
  function restoreSpies( spies ) {
    spies.forEach(function( it ) {
      it.spy.restore();
    });
  }

  /**
   * Set spies for test
   * @param item
   */
  function setSpies( item ) {
    item.sinonSpySuite && item.sinonSpySuite.forEach(function( it ) {
      var o = it.obj || oInjectedForSpies[it.objname];
      if ( o ) {
        it.spy = sinon.spy(o, it.methodname);
      }
    });
  }

  // This is the equivalent of the old waitsFor/runs syntax
  // which was removed from Jasmine 2
  // Credits: https://gist.github.com/abreckner/110e28897d42126a3bb9
  var waitsForAndRuns = function( escapeFunction, runFunction, escapeTime ) {
    if ( escapeFunction() ) {
      runFunction();
      return;
    }
    // check the escapeFunction every millisecond so as soon as it is met we can escape the function
    var interval = setInterval(function() {
      if ( escapeFunction() ) {
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
    function clearMe() {
      clearInterval(interval);
      clearTimeout(timeOut);
    }
  };
});

