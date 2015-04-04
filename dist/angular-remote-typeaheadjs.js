/*jshint -W098 */
(function () {
  'use strict';
  angular.module('angularRemoteTypeaheadjs', []).directive('angularRemoteTypeaheadjs', angularRemoteTypeaheadjs);
  /* @ngInject */
  function angularRemoteTypeaheadjs($log) {
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
          onselected: setCallback(scope.onselected, 'onselected', 'typeahead:selected'),
          onclosed: setCallback(scope.onclosed, 'onclosed', 'typeahead:closed'),
          oncursorchanged: setCallback(scope.oncursorchanged, 'oncursorchanged', 'typeahead:cursorchanged')
        };
      scope.logonwarn = (scope.logonwarn || 'false') === 'true';
      element.attr('id', elemId);
      scope.minlensugestion = scope.minlensugestion || 3;
      scope.key = scope.key || 'name';
      scope.limit = scope.limit || 25;

      configTypeaheadBloodhound();

      if (scope.cssdropdown) {
        //var oDrop = $('span:has(input#' + elemId + ') .tt-dropdown-menu');
        //(oDrop && oDrop.addClass(scope.cssdropdown));
        element[0].parentNode.lastChild.className+= ' ' + scope.cssdropdown;
      }

      element.on('typeahead:autocompleted', OnSelected);
      element.on('typeahead:selected', OnSelected);
      element.on('typeahead:closed', OnClosed);
      element.on('typeahead:cursorchanged', OnCursorChanged);

      scope.$on('$destroy', function () {
        element.typeahead('destroy');
      });


      function OnSelected(jqevent, item, dataset) {
        callback.onselected(item);
        ((scope.clearvalue === 'true') && element.typeahead('val', ''));
      }
      function OnClosed(jqevent) {
        var o={};
        o[scope.key] = element.typeahead('val');
        callback.onclosed(o);
      }
      function OnCursorChanged(jqevent, item, dataset) {
        callback.oncursorchanged(item);
      }

      function configTypeaheadBloodhound() {
        if (!scope.remote) {
          logerror('Attribute [remote] was not defined.');
        }
        if (!scope.datasource) {
          scope.datasource = 'datasource';
          (scope.logonwarn && logwarn('Attribute [datasource] was not defined. Using default name:\'datasource\''));
        }
        var objectSource = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace(scope.key),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          limit: scope.limit,
          remote: scope.remote + '%QUERY'
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

      function setCallback (fEvent, name, tag) {
        if (!(!fEvent? false : (!testIsFunction(fEvent)? false : testIsFunction(fEvent())))) {
          (scope.logonwarn && logwarn('\'' + name + '\' is not defined or is not a function.'));
          return function(item) {
            //if callback was not passed emit typeahead event on scope
            scope.$emit(tag, item);
          };
        }
        return function(item) {
          //call function callback
          fEvent()(item);
        };
      }
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
  angularRemoteTypeaheadjs.$inject = ["$log"];
}());
