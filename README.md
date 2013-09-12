# openaustralia
Node.js bindings for the http://openaustralia.org/ API.

## Installation

This module is installed via npm:

``` bash
$ npm install openaustralia
```

## Example Usage

``` js
var OpenAustralia = require('openaustralia');

var api = new OpenAustralia('SAMPLEAPIKEY');
api.getRepresentatives({ search: 'Abbott' }, function(err, data) {
  console.log(err, data);
});
```
