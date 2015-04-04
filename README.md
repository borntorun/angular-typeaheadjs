angular-remote-typeaheadjs
=======================

This is an AngularJS directive to facilitate the use in angular projects of the [typeahead.js](https://github.com/twitter/typeahead.js) autocomplete library with [Bloodhound](https://github.com/twitter/typeahead.js/blob/master/doc/bloodhound.md) integration for remote datasets. 

Requirements
---------------

[angular.js] (https://angularjs.org/)

[typeahead.js](https://github.com/twitter/typeahead.js)

How to use
---------------

Get and install the requirements.

* Install with Bower

```
$ bower install angular-remote-typeaheadjs
```

* or get the javascript in dist folder: angular-remote-typeaheadjs.js

In your html template:
```
<angular-remote-typeaheadjs remote="url_for_dataset" list_of_attributes ></angular-remote-typeaheadjs>
``` 

* list_of_attributes:

  * `remote` - (required) remote url for datasource
  * `key` - key-for-datasource-model (default=name)
  * `model` - model to bind the input
  * `onselected` - function to call on item selected: event 'typeahead:selected'
  * `onclosed` - function to call on input close dropdown and lost focus: event 'typeahead:closed'
  * `oncursorchanged` - function to call on cursor changed: event 'typeahead:cursorchanged'
  * `datasource` - name-for-css (default=datasource)
  * `limit` - max-items-to-show-on-dropdown (default=25)
  * `clearvalue` - specifies if value on input must be cleared on selection (default=false)
  * `minlensugestion` - minimum lenght for trigger dropdown (default=3)
  * `placeholder` - placeholder text
  * `cssinput` - css classes to add for input field
  * `cssdropdown` - css class for dropdown element (span.tt-dropdown-menu in typeaheadjs structure)
  * `logonwarn` - output warnings messages (default=false)

Example
---------------

In a controller:
```
var vm = this;
vm.urlRemote = '/api/categories/search/';
vm.onSelected = function (item) {
  //do something with item.name
}
```

In the html template:
```
<angular-remote-typeaheadjs onselected="vm.onSelected", remote="{{vm.urlRemote}}" cssinput="searchfiltercat", placeholder="search categories"></angular-remote-typeaheadjs>
``` 

Notes
---------------

For now:

* only one remote dataset is supported and no templates for datasets are supported.
* The typeahead:autocomplete event is assumed as a sugestion selection, so it will trigger the onselected callback. (dont know if this is the best but for now I think this is good)
* If callbacks are not passed the typeahead events are emitted on scope.
* hint on typeahead is assumed always as true

Authors
-------

* **João Carvalho** 
  * [@jmmtcarvalho](https://twitter.com/jmmtcarvalho) 
  * [GitHub](https://github.com/borntorun)

License
-------

Copyright (c) 2015 João Carvalho

Licensed under the MIT License
