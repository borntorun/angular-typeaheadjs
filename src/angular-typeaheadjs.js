/*jshint -W098 */
/**
 * Directive angular-typeaheadjs
 *
 * This is an AngularJS directive to facilitate the use in angular projects of the typeahead.js autocomplete library.
 * - typeahead.js (https://twitter.github.io/typeahead.js/)
 * - Bloodhound (https://github.com/twitter/typeahead.js/blob/master/doc/bloodhound.md)
 *
 *
 * Author: * (João Carvalho, 04/2015)
 */
(function () {
    'use strict';
    angular.module('angularTypeaheadjs', [])
        .directive('angularTypeaheadjs', angularTypeaheadjs);
    /* @ngInject */
    function angularTypeaheadjs($log, $q) {
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
                showLog: false
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
                // use as attribute: <input angular-typeaheadjs .../>
                restrict: 'E',
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
                    ngModel: '=?'
                },
                link: linkFunction
            };
        return directive;
        ////////////////
        function linkFunction(scope, element, attrs, ctrl) {
            var ttOptions, ttDatasets, typeaheadOptions, options, elinput;

            //read attr passed in
            options = scope.$eval(scope.angtyOptions);
            ttOptions = scope.$eval(scope.angtyTtoptions);
            ttDatasets = scope.$eval(scope.angtyTtdatasets);

            //set default component options and extend
            options = angular.extend( angular.copy(_defaultOptions), options || {});

            //set default typeahead options and extend
            typeaheadOptions = angular.extend(options.useOwnDefaults ? angular.copy(_defaultTTOptions) : {}, ttOptions || {});

            //verify input field exists
            if ((elinput = element.find('.typeahead')).length === 0) {
                options.showLog && (logerror('No element with ".typeahead" found to apply.', attrs.id));
                return;
            }

            //set typeahead (get a promise)
            var plugTypeaheadPromise = plugTypeahead(elinput, typeaheadOptions, ttDatasets);

            plugTypeaheadPromise.then(function (el) {
                var aEv = angular.copy(_aEvents);

                function clearVal() {
                    el.typeahead('val', '');
                }

                /*if (options.clear === true) {
                    aEv.push({event: '$select', trigger: clearVal});
                }*/
                if (options.selectOnAutocomplete === true) {
                    aEv.push({event: '$autocomplete $select', trigger: 'select'});
                    if (options.clear === true) {
                        aEv.push({event: '$autocomplete $select', trigger: clearVal});
                    }
                }
                else {
                    aEv.push({event: '$select'});
                    if (options.clear === true) {
                        aEv.push({event: '$select', trigger: clearVal});
                    }
                }
                bindEvents(el, aEv);
            }, function (el) {
                //console.log('rejected:', el);
            });

            function bindEvents(el, aEvents) {
                aEvents.forEach(function (item) {
                    var f = isFunction(item.trigger) ? item.trigger : getEventCallback((item.trigger || item.event).replace('$', ''));

                    if (f !== angular.noop) {
                        console.log(item);
                        el.on(item.event.replace(/\$/g, 'typeahead:'), options, f);
                    }

                    //f !== angular.noop && (el.on(item.event.replace(/\$/g, 'typeahead:'), options, f));
                });
            }

            function getEventCallback(tag) {
                var fcallback = scope.$eval(scope['angtyOn' + tag]);
                if (isFunction(fcallback)) {
                    return function () {
                        fcallback.apply(null, [].slice.call(arguments));
                    };
                }
                if (options.emitOnlyIfPresent === false || attrs.$attr.hasOwnProperty('angtyOn' + tag)) {
                    return function () {
                        scope.$emit('typeahead:' + tag, [].slice.call(arguments));
                    };
                }
                return angular.noop;
            }

            function plugTypeahead(element, ttopt, datasets) {
                var plugDefer = $q.defer(), datasetbh, optionsbh, optionstt, engine;
                setTimeout(function () {
                    plugIt();
                }, 0);
                return plugDefer.promise;

                function plugIt() {
                    //prepare typeahead options to pass
                    optionstt = extractKeys({highlight: null, hint: null, minLength: null, classNames: null}, ttopt);

                    //datasets were passed: set element and go out
                    if (isArray(datasets) === true) {
                        plugDefer.resolve(callTypeahead(element, optionstt, datasets));
                        return;
                    }

                    //Set internal bloodhound with prefect/remote
                    //validate options required
                    if (validateRequired(ttopt) === false) {
                        options.showLog && (logerror('One of attributes [remote|prefetch] is required.', element[0].id));
                        plugDefer.reject();
                        return;
                    }

                    //Prepare Bloodhound options to pass
                    optionsbh = extractKeys({sufficient: null, remote: null, prefetch: null}, ttopt);
                    if (optionsbh.remote) {
                        if (isString(optionsbh.remote)) {
                            optionsbh.remote = {
                                url: optionsbh.remote
                            };
                        }
                        optionsbh.remote.wildcard = optionsbh.remote.wildcard || '%QUERY';
                    }
                    optionsbh = angular.extend(optionsbh, {
                        initialize: false,
                        datumTokenizer: Bloodhound.tokenizers.obj.whitespace(ttopt.display),
                        queryTokenizer: Bloodhound.tokenizers.whitespace
                    });

                    //Set dataset for local Bloodhound
                    datasetbh = extractKeys({name: null, limit: null, display: null}, ttopt);

                    //Create Bloodhound
                    datasetbh.source = engine = new Bloodhound(optionsbh);

                    //Initialize and done
                    engine.initialize().done(function () {
                        plugDefer.resolve(callTypeahead(element, optionstt, datasetbh));
                    }).fail(function () {
                        plugDefer.reject();
                    });
                }

                /////////
                function callTypeahead(element, options, datasets) {
                    //console.log(options, datasets);
                    return element.typeahead(options, datasets);
                }

                function validateRequired(op) {

                    //se foi passado remote
                        //string not empty OU hash com url

                    //se foi passado prefetch
                        //string not empty

                    var okRemote = isDefined(op.remote) && (isStringNotEmpty(op.remote) || (isHashObject(op.remote) && isStringNotEmpty(op.remote.url))),
                        okPrefetch = isDefined(op.prefetch) && isStringNotEmpty(op.prefetch);

                    //console.log('R=', okRemote, 'P=', okPrefetch);

                    return okPrefetch || okRemote;
                }
            }
        }

        /**
         * Util functions
         */
        function extractKeys(keys, from) {
            var obj = {};
            for (var key in keys) {
                isUndefined(from[key]) || (obj[key] = from[key]);
            }
            return obj;
        }

        function isStringNotEmpty(s) {
            return isString(s) && !isEmptyString(s);
        }

        function isEmptyString(s) {
            return /^\s*$/.test(s);
        }

        function isUndefined(obj) {
            return typeof obj === 'undefined';
        }

        function isDefined(obj) {
            return typeof obj !== 'undefined';
        }

        function isFunction(obj) {
            return {}.toString.call(obj) === '[object Function]';
        }

        function isHashObject(obj) {
            return typeof obj === 'object' && obj !== null;
        }

        function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }

        function isString(obj) {
            return typeof obj === 'string';
        }

        function isInstanceOf(o, obj) {
            return o instanceof obj;
        }

        function getId() {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split(''), length = Math.floor(Math.random() * 10) + 6;
            var str = '';
            for (var i = 0; i < length; i++) {
                str += chars[Math.floor(Math.random() * chars.length)];
            }
            return 'artjs-' + str;
        }

        function logwarn(message, elemId) {
            $log.warn(message + '([angular-typeaheadjs]:id:' + elemId + ')');
        }

        function logerror(message, elemId) {
            $log.error(message + '([angular-typeaheadjs]:id:' + elemId + ')');
        }
    }
}
()
    )
;

