/*jshint -W098 */
/**
 * Directive angular-remote-typeaheadjs
 * (João Carvalho, 04/2015)
 *
 * Description: Directive to facilitate the use in angular projects of the typeahead.js autocomplete library with Bloodhound integration for remote datasets.
 * - typeahead.js (https://twitter.github.io/typeahead.js/)
 * - Bloodhound (https://github.com/twitter/typeahead.js/blob/master/doc/bloodhound.md)
 *
 * Attributtes:
 * Required:
 * remote="remote url for datasource"
 *
 * Optional:
 * key             "key-for-datasource-model (default=name)",
 * model           "model to bind the input"
 * onselected      "function to call on item selected: event 'typeahead:selected'",
 * onclosed        "function to call on input close dropdown and lost focus: event 'typeahead:closed'"
 * oncursorchanged "function to call on cursor changed: event 'typeahead:cursorchanged'"
 * datasource      "name-for-css (default=datasource)"
 * limit           "max-items-to-show-on-dropdown (default=25)"
 * clearvalue      "specifies if value on input must be cleared on selection (default=false)"
 * minlensugestion "minimum lenght for trigger dropdown (default=3)"
 * placeholder     "placeholder text"
 * cssinput        "css classes to add for input field"
 * cssdropdown     "css class for dropdown element (span.tt-dropdown-menu in typeaheadjs structure)"
 * logonwarn       "output warnings messages (default=false)"
 */
(function () {
    'use strict';
    angular.module('angularRemoteTypeaheadjs', [])
        .directive('angularRemoteTypeaheadjs', angularRemoteTypeaheadjs);
    /* @ngInject */
    function angularRemoteTypeaheadjs($log, $rootScope) {
        var directive = {
            // use as element: <angular-remote-typeaheadjs .../>
            restrict: 'E',
            replace: true,
            scope: {
                remote: '@',
                key: '@?',
                datasource: '@?',
                onselected: '&?',
                onclosed: '&?',
                oncursorchanged: '&?',
                clearvalue: '@?',
                minlensugestion: '@?',
                limit: '@?',
                placeholder: '@?',
                cssinput: '@?',
                cssdropdown: '@?',
                model: '=?',
                logonwarn: '@?'
            },
            template: function () {
                return '<input type="text" ng-model="model" placeholder="{{placeholder}}" class="typeahead {{cssinput}}"/>';
            },
            link: linkfunction
        };
        return directive;
        ////////////////
        function linkfunction(scope, element, attrs, ctrl) {
            var elemId = getId(),
                callback = {
                    //set callbacks
                    onselected: setCallback(scope.onselected, 'onselected', 'typeahead:selected'),
                    onclosed: setCallback(scope.onclosed, 'onclosed', 'typeahead:closed'),
                    oncursorchanged: setCallback(scope.oncursorchanged, 'oncursorchanged', 'typeahead:cursorchanged')
                };
            scope.logonwarn = (scope.logonwarn || 'false') === 'true';
            element.attr('id', elemId);
            scope.minlensugestion = scope.minlensugestion || 3;
            scope.key = scope.key || 'name';
            scope.limit = scope.limit || 25;

            //call typeahead and Bloodhound config
            configTypeaheadBloodhound();

            if (scope.cssdropdown) {
                //var oDrop = $('span:has(input#' + elemId + ') .tt-dropdown-menu');
                //(oDrop && oDrop.addClass(scope.cssdropdown));
                element[0].parentNode.lastChild.className += ' ' + scope.cssdropdown;
            }

            //bind local functions to events
            element.on('typeahead:autocompleted', OnSelected);
            element.on('typeahead:selected', OnSelected);
            element.on('typeahead:closed', OnClosed);
            element.on('typeahead:cursorchanged', OnCursorChanged);

            scope.$on('$destroy', function () {
                element.typeahead('destroy');
            });

            function OnSelected(jqevent, item, dataset) {
                callback.onselected(item);
                if (scope.clearvalue === 'true') {
                    element.typeahead('val', '');
                    scope.model = '';
                }
                else {
                    scope.model = element.typeahead('val');
                }
                scope.$apply();
            }

            function OnClosed(jqevent) {
                var o = {};
                scope.model = o[scope.key] = element.typeahead('val');
                callback.onclosed(o);
                scope.$apply();
            }

            function OnCursorChanged(jqevent, item, dataset) {
                callback.oncursorchanged(item);
                scope.model = item[scope.key];
                scope.$apply();
            }

            /**
             * Config typeahead and Bloodhound config
             */
            function configTypeaheadBloodhound() {
                if (!scope.remote) {
                    logerror('Attribute [remote] was not defined.');
                    return;
                }
                if (!scope.datasource) {
                    scope.datasource = 'datasource';
                    (scope.logonwarn && logwarn('Attribute [datasource] was not defined. Using default name:\'datasource\''));
                }

                var objectSource = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.obj.whitespace(scope.key),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    limit: scope.limit,
                    prefetch: undefined,
                    remote: scope.remote
                });

                //if (scope.remote) {
                objectSource.initialize().then(function () {
                    element.typeahead({
                        minLength: scope.minlensugestion,
                        highlight: true
                    }, {
                        name: scope.datasource,
                        displayKey: scope.key,
                        source: objectSource.ttAdapter()
                        /*,templates: {
                          empty: '',
                          footer: '',
                          header: ''
                        }*/
                    });
                });
                //}
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
                    (scope.logonwarn && logwarn('\'' + name + '\' is not defined or is not a function.'));
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
            function logwarn(message) {
                $log.warn(message + '([angular-remote-typeaheadjs]:id:' + elemId + ')');
            }
            function logerror(message) {
                $log.error(message + '([angular-remote-typeaheadjs]:id:' + elemId + ')');
            }
        }
    }
}());
