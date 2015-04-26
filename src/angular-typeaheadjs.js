/*jshint -W098 */
/**
 * Directive angular-typeaheadjs
 * (João Carvalho, 04/2015)
 *
 * Description: Directive to facilitate the use in angular projects of the typeahead.js autocomplete library with Bloodhound integration for remote datasets.
 * - typeahead.js (https://twitter.github.io/typeahead.js/)
 * - Bloodhound (https://github.com/twitter/typeahead.js/blob/master/doc/bloodhound.md)
 *
 * Attributtes:
 * Required (functional requirement):
 *
 *  options
 *      remote          - remote url for datasource: must return [*{}] (1)
 *      prefetch        - data to prefetch: must return [*{}], (1)
 *      key             - key-for-datasource-model (default=name),
 *      datasource      - name-for-css (default=datasource)
 *      limit           - max-items-to-show-on-dropdown (default=25)
 *      clearvalue      - specifies if value on input must be cleared on selection (default=false)
 *      minlensugestion - minimum lenght for trigger dropdown (default=3)
 *      logonwarn       - output warnings messages (default=false)
 *
 * Optional:
 *
 *  model           - model to bind the input
 *  onselected      - function to call on item selected: event 'typeahead:selected',
 *  onclosed        - function to call on input close dropdown and lost focus: event 'typeahead:closed'
 *  oncursorchanged - function to call on cursor changed: event 'typeahead:cursorchanged'
 *  attr-options    - object with additional attributes to apply to autocomplete input
 *
 * (1): one of remote|prefetch must be passed
 */
(function () {
    'use strict';
    angular.module('angularTypeaheadjs', [])
        .directive('angularTypeaheadjs', angularTypeaheadjs);
    /* @ngInject */
    function angularTypeaheadjs($log) {
        var directive = {
            // use as element: <angular-typeaheadjs .../>
            restrict: 'E',
            //require: 'ngModel',
            replace: true,
            scope: {
                options: '@?',
                attroptions: '@?attrOptions',
                onselected: '&?',
                onclosed: '&?',
                oncursorchanged: '&?',
                model: '=?'
            },
            template: '<input type="text" ng-model="model" class="typeahead"/>',
            link: linkFunction
        };
        return directive;
        ////////////////
        function linkFunction(scope, element, attrs, ctrl) {
            var options = scope.$eval(scope.options),
                attributes = scope.$eval(scope.attroptions);
            options = angular.extend({
                elemId: getId(),
                logonwarn: false,
                minlensugestion: 3,
                key: 'name',
                limit: 25,
                callback: {
                    //set callbacks
                    onselected: setCallback(scope.onselected, 'onselected', 'typeahead:selected'),
                    onclosed: setCallback(scope.onclosed, 'onclosed', 'typeahead:closed'),
                    oncursorchanged: setCallback(scope.oncursorchanged, 'oncursorchanged', 'typeahead:cursorchanged')
                }
            }, options || {});
            element.attr('id', options.elemId);
            if (attributes && typeof attributes === 'object') {
                element.attr(attributes);
            }
            //call typeahead and Bloodhound config
            configTypeaheadBloodhound(options, element);
            //bind local functions to events
            element.on('typeahead:autocompleted typeahead:selected', options, OnSelected);
            element.on('typeahead:closed', options, OnClosed);
            element.on('typeahead:cursorchanged', options, OnCursorChanged);
            scope.$on('$destroy', function () {
                element.typeahead('destroy');
            });
            function OnSelected(jqevent, item, dataset) {
                var options = jqevent.data;
                options.callback.onselected(item);
                if (options.clearvalue) {
                    element.typeahead('val', '');
                    scope.model = '';
                }
                else {
                    scope.model = element.typeahead('val');
                }
                scope.$apply();
            }

            function OnClosed(jqevent) {
                var o = {}, options = jqevent.data;
                scope.model = o[options.key] = element.typeahead('val');
                options.callback.onclosed(o);
                scope.$apply();
            }

            function OnCursorChanged(jqevent, item, dataset) {
                var options = jqevent.data;
                options.callback.oncursorchanged(item);
                scope.model = item[options.key];
                scope.$apply();
            }

            /**
             * setCallback
             * @param fEvent Callback passed in to the directive
             * @param name Name of attribute
             * @param tag typeaheadjs tag for event
             * @returns {Function} to call on event; This function will call the callback or scope.$emit the typeaheadjs event
             */
            function setCallback(fEvent, name, tag) {
                if (!(!fEvent ? false : (!testIsFunction(fEvent) ? false : testIsFunction(fEvent())))) {
                    (options.logonwarn && logwarn('\'' + name + '\' is not defined or is not a function.', options.elemId));
                    return function (item) {
                        //if callback was not passed emit typeahead event on scope
                        scope.$emit(tag, item);
                    };
                }
                return function (item) {
                    //call function callback
                    fEvent()(item);
                };
            }
        }

        function validateRequired(op) {
            if ((op.prefetch && typeof op.prefetch==='string') || (op.remote && typeof op.remote==='string')) {
                return true;
            }
            return false;
        }
        /**
         * Config typeahead and Bloodhound config
         */
        function configTypeaheadBloodhound(op, element) {

            if (validateRequired(op)===false) {
                logerror('One of attributes [remote|prefetch] is required.', op.elemId);
                return;
            }
            /*if (!(op.prefetch || op.remote)) {
                logerror('One of attributes [remote|prefetch] is required.', op.elemId);
                return;
            }
            if (!((op.prefetch && typeof op.prefetch) !== 'string' || (op.remote && typeof op.remote !== 'string'))) {
                logerror('One of attributes [remote|prefetch] is required.', op.elemId);
                return;
            }*/
            if (!op.datasource) {
                op.datasource = 'datasource';
                (op.logonwarn && logwarn('Attribute [datasource] was not defined. Using default name:\'datasource\'', op.elemId));
            }
            var objectSource = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace(op.key),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                limit: op.limit,
                prefetch: op.prefetch,
                remote: op.remote
            });
            objectSource.initialize().then(function () {
                element.typeahead({
                    minLength: op.minlensugestion,
                    highlight: true
                }, {
                    name: op.datasource,
                    displayKey: op.key,
                    source: objectSource.ttAdapter()
                    /*,templates: {
                      empty: '',
                      footer: '',
                      header: ''
                    }*/
                });
            });
        }

        /**
         * Util functions
         */
        function testIsFunction(f) {
            return {}.toString.call(f) === '[object Function]';
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
            //$log.warn(message + '([angular-typeaheadjs]:id:' + scope.options.elemId + ')');
            $log.warn(message + '([angular-typeaheadjs]:id:' + elemId + ')');
        }

        function logerror(message, elemId) {
            //$log.error(message + '([angular-typeaheadjs]:id:' + scope.options.elemId + ')');
            $log.error(message + '([angular-typeaheadjs]:id:' + elemId + ')');
        }
    }
}());

