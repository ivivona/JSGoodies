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

## Local Storage Transport

Easy way to cache requests in the Local Storage using jQuery.

### Dependencies

* jQuery
* JSON 2

### Usage

``` javascript
jQuery.ajax({
  url: '/your-endpoint-here',
  method: 'GETorPOSTorSOME_OTHER_METHOD',
  useLocalStorageCache: true, // <~ this enable the caching for this particular request. OPTIONAL, DEFAULT false.
  localStorageCacheOptions: {
    key: 'cache-key', // <~ this is the key used in the cache for storing the response. OPTIONAL, DEFAULT URL.
    namespace: 'your-name-space', // <~ a namespace to differenciate requests with the same key. OPTIONAL, DEFAULT 'LSXHR'.
    maxAge: 6000 // <~ max age for the cache entry, in milliseconds. OPTIONAL, DEFAULT (1 hour).
  }
})
```

For shorthand methods you can set the caching options using the global settings (ajaxSetup) but isn't recommended.
