[![build status](https://secure.travis-ci.org/jayferd/express-handlebars.png)](http://travis-ci.org/jayferd/express-handlebars)
# express-handlebars

## Usage

``` js
var app = require('express').createServer()
  , Handlebars = require('handlebars')
;

require('express-handlebars')(app, Handlebars);
```

## Why

This package hooks into `express.helpers` and `express.dynamicHelpers`, and ensures that `Handlebars.registerHelper` is called properly, so that custom block helpers can be defined in the usual express-ive way.
