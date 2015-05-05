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


## Default use case

In your html template (default and minimal use case):
```
<angular-typeaheadjs options='{remote:"url_for_remote_dataset"}'></angular-typeaheadjs>
```
or
```
<angular-typeaheadjs options='{prefetch:"url_for_prefetch_dataset"}'></angular-typeaheadjs>
```

So, for the default use case the directive component will create an typeahead autocomplete input with an associate Bloddhound source as a dataset from a remote or prefecth url. (see [options](#foroptions)) 

## attributes

#### for options
* `?t-options` - options hash - Mimic the typeaheadjs options (when not passed the single options passed in will be used) (1)
* `?t-datasets` - [*{}] - Mimic the typeaheadjs datasets (when not passed the b-engine option will be used for source) (1)
* `?b-engine` - Bloodhound instance to use as source for the dataset (when not passed in a Bloodhound for remote and/or prefecth will be create with single options passed in - default use case) (1) 
        * (1) no validation is made on content of the datasets apart the type validation (is an array)
* `?options` - options hash (will be used if typeaheadOptions is not passed in)
      * `?highlight` - (default=true) - the typeaheadjs highlight option
      * `?hint` - (default=true) - the typeaheadjs hint option
      * `?minLength` - (default=3) - the typeaheadjs minLength option
      * `?classNames` - the typeaheadjs classNames option
      * `?datasetName` - typeaheadjs dataset.name for the default use case  
      * `?display` - (default='name') - typeaheadjs dataset.display for the default use case
      * `?limit` - (default=5) - typeaheadjs dataset.limit for the default use case
      * `?sufficient` - (default=5) - Bloodhound sufficient option for the default use case
      * `?prefetch` - Bloodhound prefetch option for the default use case (2)
      * `?remote` - Bloodhound remote option for the default use case (2)
        * (2) in the default use case one of remote|prefetch must be passed
      * `?selectOnAutocomplete` - (default=false) - Indicates that the select event is triggered when autocomplete occurs
      * `?clear:new` - (default:true) - clear the value on input on suggestion selection
      * `?log:new` - (default:false) - show console log warnings and errors       
* `?model` - Property on scope to bind the input
* `?more-attrs` - object with additional attributes to apply to the input


#### for events
* `?event-onactive` - funtion to call on the typeahead:active event
* `?event-onidle` - funtion to call on the typeahead:idle
* `?event-onopen` - funtion to call on the typeahead:open
* `?event-onclose` - funtion to call on the typeahead:close
* `?event-onchange` - funtion to call on the typeahead:change
* `?event-onrender` - funtion to call on the typeahead:render
* `?event-onselect` - funtion to call on the typeahead:select
* `?event-onautocomplete` - funtion to call on the typeahead:autocomplete
* `?event-oncursorchange` - funtion to call on the typeahead:cursorchange
* `?event-onasyncrequest` - funtion to call on the typeahead:asyncrequest
* `?event-onasynccancel` - funtion to call on the typeahead:asynccancel
* `?event-onasyncreceive` - funtion to call on the typeahead:asyncreceive
  * if callbacks are not passed the typeahead events are emitted on scope and must be catched like:
 ```
  $scope.$on('typeahead:select', function(event, data) {
     //do something 
  });
 ```
 
Examples
---------------

Default use case + binding some events and set some attributes

In html
```
<angular-typeaheadjs options="{{vm.options}}" event-onselect="vm.onSelected" event-onclose="vm.onClosed" more-attrs='{{vm.moreattrs}}'></angular-typeaheadjs>
``` 

In the associated controller:
```
var vm = this;
vm.options = {
  remote: '/some/url/for/data/%QUERY'
}
vm.onSelected = function (event, item) {
  //do something with item selected
}
vm.moreattrs = {
  placeholder: 'the placeholder text'
}
```

Notes
---------------

* This is a work in progress.

* Latest release only supports [typeahead.js ~0.11.0](https://github.com/twitter/typeahead.js/releases/tag/v0.11.0)
* Will try to follow the typeaheadjs development and releaes on new features and changes 

Authors
-------

* **João Carvalho** 
  * [@jmmtcarvalho](https://twitter.com/jmmtcarvalho) 
  * [GitHub](https://github.com/borntorun)

License
-------

Copyright (c) 2015 João Carvalho

Licensed under the MIT License
