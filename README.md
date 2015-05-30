[![Build Status](https://travis-ci.org/borntorun/angular-typeaheadjs.svg?branch=master)](https://travis-ci.org/borntorun/angular-typeaheadjs)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

angular-typeaheadjs
=======================

An AngularJS directive to serve as a wrapper to the [typeahead.js](https://github.com/twitter/typeahead.js) autocomplete library.
It allows to apply to an input field the autocomplete typeahead.js features.
In the default use case it will apply autocomplete search functionality for an `input.typeahead`. A dataset with a [Bloddhound](https://github.com/twitter/typeahead.js/blob/master/doc/bloodhound.md) engine as source will be created retrieving data from prefecth and/or remote urls.

Requirements
------------

[angular.js] (https://angularjs.org/)

[typeahead.js](https://github.com/twitter/typeahead.js) **version: ~0.11.0**

[Q](https://github.com/kriskowal/q) **version: 1.0.1**

How to use
----------

Get and install the requirements.

* Install with Bower

```
$ bower install angular-typeaheadjs
```

* or get the javascript in dist folder: angular-typeaheadjs.js

[See the demo page](http://borntorun.github.io/angular-typeaheadjs/)

## Use

In your html template (default and minimal use case):
```html
<angular-typeaheadjs angty-ttoptions="..." angty-ttdatasets="..." angty-options="..." ...>
  <input class="typeahead" type="text" ... />
</angular-typeaheadjs>
```

### Attributes

#### for options configuration

* `angty-ttoptions` - optional - options hash - mimic the typeaheadjs options - used to configure options when NOT using attribute `angty-ttdatasets`
  * For typeahead options (Group I)
    * `highlight` - `optional`, `default=true`
    * `hint` - `optional`, `default=true`
    * `minLength` - `optional`, `default=3`
    * `classNames` - `optional`
  * For typeahead dataset options (Group II)
    * `name` - `optional`
    * `display` - `optional`, `default='name'`
    * `limit` - `optional`, `default=10`
  * For Bloodhound options (Group III)
    * `sufficient` - `optional`, `default=10`
    * `prefetch` - `optional`. A URL string for prefecth data.
    * `remote` - `optional`. Can be a URL string for remote suggestions or an options hash. Only `remote.url` and `remote.wildcard` (`default=%QUERY`) are supported.        
      * In the default use case (`angty-ttdatasets` is not passed) one of `remote|prefetch` must be passed in

* `angty-ttdatasets` - optional - An expression that resolves to an array of typeahead datasets [*{}] to pass to typeahead.datasets (the datasets are used as is, no options(from groups II | III) from the 'angty-ttoptions' attribute are considered). When this attribute is NOT passed, an internal dataset with a Bloodhound engine as source is created for prefetch and/or remote suggestions, with group I `angty-ttoptions` (or defaults) applied.
      * No validation is made on content of the datasets apart the type validation (is-an-array)

* `angty-options` - optional - options hash for other options for the component
    * `useOwnDefaults` - `optional`, `default=true`. Specifying that the components default values will be used instead of typeaheadjs default ones. 
    * `selectOnAutocomplete` - `optional`, `default=false`. Specifying that the `select` event is triggered when `autocomplete` event occurs.
    * `clear` - `optional`, `default=true`. Indicates that the value on input must be cleared on suggestion selection.
    * `emitOnlyIfPresent` - `optional`, `default=true`. Indicates to only emit on scope the typeahead events that were explicity included in the html tag.
    * `showLog` - `optional`, `default=false`. Turn on/off the warnings and errors messages when initializing.       

Example 1: set an autocomplete search from prefetch and remote data and overriding some options
```html
<angular-typeaheadjs angty-options="{{vm.options}}" angty-ttoptions="{{vm.ttOptions}}">
  <input class="typeahead" type="text"/>
</angular-typeaheadjs>
``` 

```javascript
//on the controller
var vm = this;

vm.options = {
    useOwnDefaults: true,
    showLog: true
};
vm.ttOptions = {
  minLength: 2,
  limit: 10,
  prefetch: '/url/for/prefetch/data',
  remote: '/url/for/remote/data'
};
```

Example 2: sending multiple datasets with typeaheadjs defaults
```html
<angular-typeaheadjs angty-datasets="vm.datasets">
  <input class="typeahead" type="text"/>
</angular-typeaheadjs>
``` 

```javascript
//on the controller
var vm = this;

vm.options = {useOwnDefaults: false, clear:false};

var nbaTeams = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('team'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  local: [{ "team": "Boston Celtics" },{ "team": "Dallas Mavericks" },...,{ "team": "Sacramento Kings" }]
});

var nhlTeams = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('team'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  local: [{ "team": "New Jersey Devils" },{ "team": "New York Islanders" },...,{ "team": "San Jose Sharks" }]
});

vm.ttDatasets = [{
    name: 'nba-teams',
    display: 'team',
    source: nbaTeams,
    templates: {header: '<h3 class="league-name">NBA Teams</h3>'}
},
{
    name: 'nhl-teams',
    display: 'team',
    source: nhlTeams,
    templates: {header: '<h3 class="league-name">NHL Teams</h3>'}
}];
```


#### for events configuration
```html
<angular-typeaheadjs angty-onactive="..." angty-onidle="..." angty-onopen="..." ... >
  <input class="typeahead" type="text" ... />
</angular-typeaheadjs>
```
* `angty-onactive` - funtion to call on the `typeahead:active` event
* `angty-onidle` - funtion to call on the `typeahead:idle` event
* `angty-onopen` - funtion to call on the `typeahead:open` event
* `angty-onclose` - funtion to call on the `typeahead:close` event
* `angty-onchange` - funtion to call on the `typeahead:change` event
* `angty-onrender` - funtion to call on the `typeahead:render` event
* `angty-onselect` - funtion to call on the `typeahead:select` event
* `angty-onautocomplete` - funtion to call on the `typeahead:autocomplete` event
* `angty-oncursorchange` - funtion to call on the `typeahead:cursorchange` event
* `angty-onasyncrequest` - funtion to call on the `typeahead:asyncreques`t event
* `angty-onasynccancel` - funtion to call on the `typeahead:asynccancel` event
* `angty-onasyncreceive` - funtion to call on the `typeahead:asyncreceive` event

Example:
```html
<angular-typeaheadjs angty-onselect="vm.onselect" ...>
  <input class="typeahead" type="text" ... />
</angular-typeaheadjs>
``` 

```javascript
//on the controller
vm.onselect = function() {
  //do something 
}
```
    
* if callbacks are not passed and `emitOnlyIfPresent=false` all the typeahead events are emitted on scope. Can be catch as:

```javascript
$scope.$on('typeahead:select', function() {
  //do something 
});
```

* if `emitOnlyPresent=true` only the ones that were explicity included as an attribute are emitted

```html
<angular-typeaheadjs angty-onselect ...>
  <input class="typeahead" type="text" ... />
</angular-typeaheadjs>
```

```javascript
$scope.$on('typeahead:select', function() {
  //do something 
});
```

Notes
---------------

* This is a work in progress.
* Latest release only supports [typeahead.js ~0.11.0](https://github.com/twitter/typeahead.js/releases/tag/v0.11.0)
* Will try to follow the typeaheadjs development and releaes on new features and changes.

Contribution
---------------

* Contributions and comments are welcome.

Authors
-------

* **João Carvalho** 
  * [@jmmtcarvalho](https://twitter.com/jmmtcarvalho) 
  * [GitHub](https://github.com/borntorun)

License
-------

Copyright (c) 2015 João Carvalho

Licensed under the MIT License
