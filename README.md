JSGoodies
=========

Some js little helpers.

## Query String

Friendly inspector of the query string parameters in the url. Has a little dependency with jQuery, but I plan to change that soon.

### Usage

``` javascript
// http://www.my-site.com/a/b/c?foo=X
QueryString.current().hasParameterNamed('foo') ~> true

// http://www.my-site.com/a/b/c?bar=1&bar=2&bar=3
QueryString.current().parametersNamed('bar') ~> [1, 2, 3]

// http://www.my-site.com/a/b/c?bar=1&bar=2&bar=3
QueryString.current().parameterNamed('bar') ~> 1

// http://www.my-site.com/a/b/c?foo=X
QueryString.current().parametersNamed('bar') ~> undefined

// http://www.my-site.com/a/b/c?foo=X
QueryString.current().parametersNamed('bar') ~> undefined

// http://www.my-site.com/a/b/c?foo
QueryString.current().parametersNamed('foo') ~> null

new QueryString('http://www.google.com/?q=cats').parameterNamed('q')
```