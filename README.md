[![Build Status](https://travis-ci.org/borntorun/angular-typeaheadjs.svg?branch=master)](https://travis-ci.org/borntorun/angular-typeaheadjs)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

angular-typeaheadjs
=======================

This is an AngularJS directive to facilitate the use in angular projects of the [typeahead.js](https://github.com/twitter/typeahead.js) autocomplete library.

Requirements
---------------

[angular.js] (https://angularjs.org/)

[typeahead.js](https://github.com/twitter/typeahead.js)

How to use
---------------

Get and install the requirements.

* Install with Bower

```
$ bower install angular-typeaheadjs
```

* or get the javascript in dist folder: angular-typeaheadjs.js

In your html template:
```
<angular-typeaheadjs options='{remote:"url_for_dataset"}' list_of_attributes></angular-typeaheadjs>
``` 

* Options:

  * `remote` - remote url for remote data (see [doc](https://github.com/borntorun/typeahead.js/blob/master/doc/bloodhound.md#remote))
  * `prefetch` - url for data to prefetch (see [doc](https://github.com/borntorun/typeahead.js/blob/master/doc/bloodhound.md#prefetch))
  * `key` - key for value in data (default=name)
  * `datasource` - name-for-css (default=datasource)
  * `limit` - max-items-to-show-on-dropdown (default=25)
  * `clearvalue` - specifies if value on input must be cleared on selection (default=false)
  * `minlensugestion` - minimum lenght for trigger dropdown (default=3)
  * `logonwarn` - output warnings messages (default=false)
    
* list_of_attributes:
  * `onselected` - function to call on item selected: event 'typeahead:selected'
  * `onclosed` - function to call on input close dropdown and lost focus: event 'typeahead:closed'
  * `oncursorchanged` - function to call on cursor changed: event 'typeahead:cursorchanged'
  * `model` - model to bind the input

Example
---------------

In the html template:
```
<angular-typeaheadjs options="vm.options" onselected="vm.onSelected"></angular-typeaheadjs>
``` 

In a controller:
```
var vm = this;
vm.options = {
  remote: '/api/categories/search/%QUERY',
  cssinput: 'searchfiltercat',
  placeholder: 'search categories'  
}
vm.onSelected = function (item) {
  //do something with item.name
}
```

Notes
---------------

* This is a work in progress.

For now:
* Only supports [typeahead.js v0.10.5](https://github.com/twitter/typeahead.js/releases/tag/v0.10.5). Work is being done to support new versions. 
* Only Bloodhound suggestions engine integration with remote and prefetch urls is supported (no local dataset).
* Only one dataset is supported and no templates for datasets are supported.
* The typeahead:autocomplete event is assumed as a sugestion selection, so it will trigger the onselected callback. (dont know if this is the best but for now I think this is good)
* If callbacks are not passed the typeahead events are emitted on scope.
* hint option on typeahead is always true
* highlight option  on typeahead is always true

Authors
-------

* **João Carvalho** 
  * [@jmmtcarvalho](https://twitter.com/jmmtcarvalho) 
  * [GitHub](https://github.com/borntorun)

License
-------

Copyright (c) 2015 João Carvalho

Licensed under the MIT License
