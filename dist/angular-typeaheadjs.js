/*jshint -W098 */
(function() {
  'use strict';
  angularTypeaheadjs.$inject = ["$log", "Q"];
  angular.module('angularTypeaheadjs', [])
    .constant('Q', Q)
    .directive('angularTypeaheadjs', angularTypeaheadjs);
  /**
   * @ngdoc directive
   * @name angularTypeaheadjs
   * @restrict ACE
   * @description
   * An AngularJS directive to serve as a wrapper to the [typeahead.js](https://github.com/twitter/typeahead.js) autocomplete library.
   * It allows to apply to an input field the autocomplete typeahead.js features.
   * In the default use case it will apply autocomplete search functionality for an `input.typeahead`. A dataset with a [Bloddhound](https://github.com/twitter/typeahead.js/blob/master/doc/bloodhound.md) engine as source will be created retrieving data from prefecth and/or remote urls.
   *
   * ```html
   * <angular-typeaheadjs angty-ttoptions="..." angty-ttdatasets="..." angty-options="..." ...>
   *  <input class="typeahead" type="text" ... />
   * </angular-typeaheadjs>
   ```
   * #### Note
   *  Although all the parameters are optional, at least `angty-ttoptions` or `angty-ttdatasets` must be used for the component to be useful.
   *
   * @param {object=} angty-options options hash to apply for configuration. Valid keys:
   *  - `[useOwnDefaults=true]`: boolean value specifying that the components default values will be used instead of typeaheadjs default ones.
   *  - `[selectOnAutocomplete=false]`: boolean value specifying that the `select` event is triggered when `autocomplete` event occurs.
   *  - `[clear=false]`: boolean value which indicates that the value on input must be cleared on suggestion selection.
   *  - `[emitOnlyIfPresent=true]`: boolean value which indicates to only emit on scope the typeahead events that were explicity included in the html tag.
   *  - `[setSameListenerEventBefore]`: boolean value which indicates to set the the listener to typeahead:before<event> the same that is set to typeahead:<event>
   *  - `[showLog=false]`: boolean value to turn on/off the warnings and errors messages when initializing.
   *  - `[watchInitEvent=false]`: boolean value that indicates that a watch to 'angtty:init:<input id|input name>' event must be set on parent scope (this event will occurs only once)
   *                                 use case: default value of input is delayed on some async proccess (ajax call) which cause the value of query to be empty on initialization of typeahead
   *                                 so this allows the consumer to emit this event and set the proper value; the handler will call input.typeahead('val', value_passed_in);
   *  - `[watchSetValEvent=false]`: boolean value that indicates that a watch to 'angtty:setval:<input id|input name>' event must be set on parent scope
   *                                 use case: allows the consumer to emit this event and set the input value; the handler will call input.typeahead('val', value_passed_in);

   * @param {object=} angty-ttoptions options hash for the typeahead configuration. Mimic the typeaheadjs options - used to configure options when NOT using attribute `angty-ttdatasets`. Valid keys:
   * - Group I - typeahead options
   *  - `[highlight=true]`: boolean value see typeaheadjs documentation
   *  - `[hint=true]`: boolean value see typeaheadjs documentation
   *  - `[minLength=3]`: integer value see typeaheadjs documentation
   *  - `[classNames]`: object see typeaheadjs documentation
   * - Group II - typeahead dataset options
   *  - `[name]`: string value (see typeaheadjs documentation)
   *  - `[display="name"]`: string value (see typeaheadjs documentation)
   *  - `[limit=10]`: integer value (see typeaheadjs documentation)
   * - Group III - Bloodhound options
   *  - `[sufficient=10]`: integer value (see typeaheadjs documentation)
   *  - `[prefetch]`: string url (see typeaheadjs documentation)
   *  - `[remote]`: string url or an options hash; Only `remote.url` and `remote.wildcard` (`default=%QUERY`) are supported. (see typeaheadjs documentation)
   * @param {expression=} angty-ttdatasets optional expression that resolves to an array of typeahead datasets [*{}] to pass to typeahead.datasets (the datasets are used as is, no options(from groups II | III) from the 'angty-ttoptions' attribute are considered).
   *                                        When this attribute is NOT passed, an internal dataset with a Bloodhound engine as source is created for prefetch and/or remote suggestions, with group I `angty-ttoptions` (or defaults) applied.
   * @param {expression=} angty-bhfunctions optional expression that resolves to an object with functions to be passed to Bloodhound - identify/sorter - (see Bloodhound documentation)
   * @param {expression=} angty-onactive function handler to the `typeahead:active` event
   * @param {expression=} angty-onidle function handler to the `typeahead:idle` event
   * @param {expression=} angty-onopen function handler to the `typeahead:open` event
   * @param {expression=} angty-onclose function handler to the `typeahead:close` event
   * @param {expression=} angty-onchange function handler to the `typeahead:change` event
   * @param {expression=} angty-onrender function handler to the `typeahead:render` event
   * @param {expression=} angty-onselect function handler to the `typeahead:select` event
   * @param {expression=} angty-onautocomplete function handler to the `typeahead:autocomplete` event
   * @param {expression=} angty-oncursorchange function handler to the `typeahead:cursorchange` event
   * @param {expression=} angty-onasyncrequest function handler to the `typeahead:asyncrequest` event
   * @param {expression=} angty-onasynccancel function handler to the `typeahead:asynccancel` event
   * @param {expression=} angty-onasyncreceive function handler to the `typeahead:asyncreceive` event
   *
   * @param {expression=} angty-onbeforeactive function handler to the `typeahead:beforeactive` event
   * @param {expression=} angty-onbeforeidle function handler to the `typeahead:beforeidle` event
   * @param {expression=} angty-onbeforeopen function handler to the `typeahead:beforeopen` event
   * @param {expression=} angty-onbeforeclose function handler to the `typeahead:beforeclose` event
   * @param {expression=} angty-onbeforeautocomplete function handler to the `typeahead:beforeautocomplete` event
   * @param {expression=} angty-onbeforeselect function handler to the `typeahead:beforeselect` event
   * @param {expression=} angty-onbeforecursorchange funtion handler to the `typeahead:beforecursorchange` event
   */

  /* @ngInject */
  function angularTypeaheadjs( $log, Q ) {
    var _aEvents = [
        {event: '$active'},
        {event: '$idle'},
        {event: '$open'},
        {event: '$close'},
        {event: '$change'},
        {event: '$render'},
        {event: '$autocomplete'},
        {event: '$cursorchange'},
        {event: '$asyncrequest'},
        {event: '$asynccancel'},
        {event: '$asyncreceive'}
      ],
      _defaultOptions = {
        useOwnDefaults: true,
        selectOnAutocomplete: false,
        clear: false,
        emitOnlyIfPresent: true,
        showLog: false,
        watchInitEvent: false,
        watchSetValEvent: false
      },
      _defaultTTOptions = {
        highlight: true,
        hint: true,
        minLength: 3,
        display: 'name',
        limit: 10,
        sufficient: 10
      },
      directive = {
        restrict: 'ACE',
        scope: {
          angtyOptions: '@?',
          angtyTtoptions: '@?',
          angtyTtdatasets: '&?',

          angtyOnactive: '&?',
          angtyOnidle: '&?',
          angtyOnopen: '&?',
          angtyOnclose: '&?',
          angtyOnchange: '&?',
          angtyOnrender: '&?',
          angtyOnselect: '&?',
          angtyOnautocomplete: '&?',
          angtyOncursorchange: '&?',
          angtyOnasyncrequest: '&?',
          angtyOnasynccancel: '&?',
          angtyOnasyncreceive: '&?',

          angtyOnbeforeactive: '&?',
          angtyOnbeforeidle: '&?',
          angtyOnbeforeopen: '&?',
          angtyOnbeforeclose: '&?',
          angtyOnbeforeautocomplete: '&?',
          angtyOnbeforecursorchange: '&?',
          angtyOnbeforeselect: '&?',

          ngModel: '=?',
          angtyBhfunctions: '&?'
        },
        link: linkFunction
      };
    return directive;
    ////////////////
    function linkFunction( scope, element, attrs, ctrl ) {
      var ttOptions, ttDatasets, bhFunctions, typeaheadOptions, options, elinput, evToUnbind = [];

      //read attr passed in
      options = scope.$eval(scope.angtyOptions);
      ttOptions = scope.$eval(scope.angtyTtoptions);
      ttDatasets = scope.$eval(scope.angtyTtdatasets);
      bhFunctions = scope.$eval(scope.angtyBhfunctions);

      //set default component options and extend
      options = angular.extend(angular.copy(_defaultOptions), options || {});

      //set default typeahead options and extend
      typeaheadOptions = angular.extend(options.useOwnDefaults ? angular.copy(_defaultTTOptions) : {}, ttOptions || {});

      //verify input field exists
      if ( (elinput = element.find('.typeahead')).length === 0 ) {
        options.showLog && (logerror('No element with ".typeahead" found to apply.', attrs.id));
        return;
      }

      //set event handlers on scope.parent
      var watchEventHandlers = [];
      var inputName = elinput.attr('id') || elinput.attr('name');
      if ( inputName ) {
        options.watchInitEvent === true && watchEventHandlers.push(setEventHandler(scope.$parent, elinput, 'angtty:init:' + inputName, true));
        options.watchSetValEvent === true && watchEventHandlers.push(setEventHandler(scope.$parent, elinput, 'angtty:setval:' + inputName, false));

        if ( watchEventHandlers.length > 0 ) {
          scope.$parent.$on('$destroy', function() {
            watchEventHandlers.forEach(function( item ) {
              try {
                item && item();
              } catch( e ) {
                $log(e);
              }
            });
          });
        }

      }
      else {
        options.showLog && logerror('Input element has no "id" or "name" attribute.', attrs.id);
      }

      //set typeahead (get a promise)
      var plugTypeaheadPromise = plugTypeahead(elinput, typeaheadOptions, ttDatasets, bhFunctions);

      plugTypeaheadPromise
        .then(function( el ) {
          var aEv = angular.copy(_aEvents);

          function clearVal() {
            el.typeahead('val', '');
          }

          if ( options.selectOnAutocomplete === true ) {
            aEv.push({event: '$autocomplete $select', trigger: 'select'});
            if ( options.clear === true ) {
              aEv.push({event: '$autocomplete $select', trigger: clearVal});
            }
          }
          else {
            aEv.push({event: '$select'});
            if ( options.clear === true ) {
              aEv.push({event: '$select', trigger: clearVal});
            }
          }
          bindEvents(el, aEv);
        })
        .catch(function( error ) {
          options.showLog && (logerror(error, elinput[0].id));
        });

      function setEventHandler( scopeParent, el, name, cancel ) {
        var handler = scopeParent.$on(name, function( event, value ) {
          //typeahead was not plugged in
          if ( el.attr('class').indexOf('tt-input') === -1 ) {
            return;
          }
          //console.log('on:' + name);
          el.typeahead('val', value);
          cancel && handler();
        });
        return handler;
      }

      function setListener( el, name, opt, handler ) {
        evToUnbind.push({
          el: el,
          name: name,
          opt: opt,
          handler: handler
        });
        el.on(name, opt, handler);
      }
      function bindEvents( el, aEvents ) {
        for ( var i = 0; i < aEvents.length; i++ ) {
          var item = aEvents[i];
          //get listener to event tag
          var fEvent = isFunction(item.trigger) ? item.trigger : getEventCallback((item.trigger || item.event).replace('$', ''));
          var existsTagFunction = (fEvent !== angular.noop);
          //set listener if exists
          existsTagFunction && (setListener(el, item.event.replace(/\$/g, 'typeahead:'), options, fEvent));

          //get listener to before event tag
          var fEventBefore = isFunction(item.trigger) ? angular.noop : getEventCallback('before' + (item.trigger || item.event).replace('$', ''));

          //set listener if exists
          if ( fEventBefore !== angular.noop ) {
            setListener(el, item.event.replace(/\$/g, 'typeahead:before'), options, fEventBefore);
          }
          else {
            //if not and triggerBeforeSameListener is set
            if ( options.setSameListenerEventBefore === true && existsTagFunction ) {
              //set the same listener
              setListener(el, item.event.replace(/\$/g, 'typeahead:before'), options, fEvent);
            }
          }
        }
        if ( evToUnbind.length > 0 ) {
          scope.$on('$destroy', function() {
            evToUnbind.forEach(function( item ) {
              try {
                item.el.off(item.name, item.handler);
              } catch( e ) {
              }
            });
          });
        }
      }

      function getEventCallback( tag ) {
        var fcallback = scope.$eval(scope['angtyOn' + tag]);
        if ( isFunction(fcallback) ) {
          return function() {
            fcallback.apply(null, [].slice.call(arguments));
          };
        }
        if ( options.emitOnlyIfPresent === false || attrs.$attr.hasOwnProperty('angtyOn' + tag) ) {
          return function() {
            //(https://github.com/borntorun/angular-typeaheadjs/issues/6)
            var avars = [].slice.call(arguments);
            var input = arguments[0].target;
            avars.push({
              id: input.id,
              name: input.name,
              value: input.value
            });
            scope.$emit('typeahead:' + tag, avars);
          };
        }
        return angular.noop;
      }

      function plugTypeahead( element, ttopt, datasets, bhFunctions ) {
        var plugDefer = Q.defer(), datasetbh, optionsbh, optionstt, engine;
        setTimeout(function() {
          plugIt();
        }, 0);

        return plugDefer.promise;

        function plugIt() {
          //prepare typeahead options to pass
          optionstt = extractKeys({highlight: null, hint: null, minLength: null, classNames: null}, ttopt);

          //datasets were passed and is an array set element and go out
          if ( isArray(datasets) === true ) {
            plugDefer.resolve(callTypeahead(element, optionstt, datasets));
            return;
          }
          else {
            if ( isDefined(datasets) === true ) {
              plugDefer.reject('angty-ttdatasets must be an array.');
              return;
            }
          }

          //Set internal bloodhound with prefect/remote
          //validate options required
          if ( validateRequired(ttopt) === false ) {
            plugDefer.reject('One of attributes [remote|prefetch] is required.');
            return;
          }

          //Prepare Bloodhound options to pass
          optionsbh = extractKeys({sufficient: null, remote: null, prefetch: null}, ttopt);
          if ( optionsbh.remote ) {
            if ( isString(optionsbh.remote) ) {
              optionsbh.remote = {
                url: optionsbh.remote
              };
            }
            optionsbh.remote.wildcard = optionsbh.remote.wildcard || '%QUERY';
          }
          optionsbh = angular.extend(optionsbh, {
            initialize: false,
            identify: bhFunctions && bhFunctions.identify ? bhFunctions.identify : function( obj ) {
              return obj[ttopt.display];
            },
            sorter: bhFunctions && bhFunctions.sorter ? bhFunctions.sorter : undefined,
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace(ttopt.display),
            queryTokenizer: Bloodhound.tokenizers.whitespace
          });

          //Set dataset for local Bloodhound
          datasetbh = extractKeys({name: null, limit: null, display: null}, ttopt);

          //Create Bloodhound
          datasetbh.source = engine = new Bloodhound(optionsbh);

          //Initialize and done
          engine.initialize().done(function() {
            plugDefer.resolve(callTypeahead(element, optionstt, datasetbh));
          }).fail(function() {
            plugDefer.reject('engine.initialize failed.');
          });
        }

        /////////
        function callTypeahead( element, options, datasets ) {
          return element.typeahead(options, datasets);
        }

        function validateRequired( op ) {

          //if remote was passed
          //and is string-not-empty or hash with url
          //if prefetch was passed
          //and is string-not-empty
          var okRemote = isDefined(op.remote) && (isStringNotEmpty(op.remote) || (isHashObject(op.remote) && isStringNotEmpty(op.remote.url))),
            okPrefetch = isDefined(op.prefetch) && isStringNotEmpty(op.prefetch);
          return okPrefetch || okRemote;
        }
      }

    }

    /**
     * Util functions
     */
    function extractKeys( keys, from ) {
      var obj = {};
      for ( var key in keys ) {
        isUndefined(from[key]) || (obj[key] = from[key]);
      }
      return obj;
    }

    function isStringNotEmpty( s ) {
      return isString(s) && !isEmptyString(s);
    }

    function isEmptyString( s ) {
      return /^\s*$/.test(s);
    }

    function isUndefined( obj ) {
      return typeof obj === 'undefined';
    }

    function isDefined( obj ) {
      return typeof obj !== 'undefined';
    }

    function isFunction( obj ) {
      return {}.toString.call(obj) === '[object Function]';
    }

    function isHashObject( obj ) {
      return typeof obj === 'object' && obj !== null;
    }

    function isArray( obj ) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function isString( obj ) {
      return typeof obj === 'string';
    }

    function isInstanceOf( o, obj ) {
      return o instanceof obj;
    }

    function getId() {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split(''), length = Math.floor(Math.random() * 10) + 6;
      var str = '';
      for ( var i = 0; i < length; i++ ) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      return 'artjs-' + str;
    }

    function logwarn( message, elemId ) {
      $log.warn(message + '([angular-typeaheadjs]:id:' + elemId + ')');
    }

    function logerror( message, elemId ) {
      $log.error(message + '([angular-typeaheadjs]:id:' + elemId + ')');
    }
  }
}());
