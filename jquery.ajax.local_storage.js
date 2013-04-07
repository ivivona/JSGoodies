/*
jQuery LocalStorage cache for XHR
=================================

Using jQuery custom transport feature LocalStorageXHR caches responses on the client's local storage.

Dependencies
------------

  jQuery: http://jquery.com
  json2: http://www.JSON.org/json2.js

Usage
-----

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

*/
jQuery.ajaxTransport("+*", function(options, originalOption, jqXHR) {
  if(!window.localStorage) return;
  if(options.useLocalStorageCache) {
    var cacheOptions = jQuery.extend({
      key: options.url,
      namespace: 'LSXHR',
      maxAge: 60 * 60 * 1000 // 1 hour
    }, options.localStorageCacheOptions);
    return new LocalStorageXHR(options, cacheOptions);
  }
});

function LocalStorageXHR(options, cacheOptions) {
  this.options = options;
  this.cacheOptions = cacheOptions;
}

jQuery.extend(LocalStorageXHR.prototype, {
  send: function(headers, completeCallback /* function( status, statusText, responses, headers ) {} */) {
    if(this.shouldFetch()) {
      var self = this;
      this.jqXHR = jQuery.ajax(this.optionsWithoutCaching()).done(function(data, statusText, jqXHR) {
        var response = [jqXHR.status, statusText, self.rawResponse(jqXHR), jqXHR.getAllResponseHeaders()];
        self.cache(response);
        completeCallback.apply(window, response);
      });
      return;   
    }
    completeCallback.apply(window, this.cachedSend());
  },
  abort: function() {
    if(this.jqXHR) this.jqXHR.abort();
  },
  rawResponse: function(jqXHR) {
    var responses = {};
    responses[jqXHR.getResponseHeader("content-type")] = jqXHR.responseText;
    return responses;    
  },
  optionsWithoutCaching: function() {
    var newOptions = jQuery.extend({}, this.options);
    newOptions.useLocalStorageCache = false;
    return newOptions;
  },
  cache: function(response) {
    window.localStorage.setItem(this.key(), JSON.stringify([response, this.expiration()]));
  },
  key: function() {
    return this.cacheOptions.namespace + ':' this.cacheOptions.key;
  },
  shouldFetch: function() {
    return !this.cachedSend();
  },
  cachedSend: function() {
    try {
      var item = JSON.parse(window.localStorage.getItem(this.key()));
      if(!item || new Date(item[1]) < new Date()) return null;
      return item[0];
    } catch(e) { // corrupted local storage
      if(console && console.log) console.log("LocalStorageXHR: corrupted local storage entry", this.key(), e);
      return null;
    }
  },
  expiration: function() {
    var now = new Date();
    return now.setTime(now.getTime() + this.cacheOptions.maxAge);
  }   
});
