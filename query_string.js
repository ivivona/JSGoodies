function QueryString(url) {
  this._url = url;
  this._parameters = this.toObject();
}

QueryString.prototype.hasParameterNamed = function(name) {
  return this._parameters.hasOwnProperty(name);
}

QueryString.prototype.parameterNamed = function(name) {
  return (this.parametersNamed(name) || [])[0];
}

QueryString.prototype.parametersNamed = function(name) {
  return this._parameters[name];
}

QueryString.prototype.setParameter = function(name, value) {
  this._parameters[name] = value;
  return this._parameters[name];
}

QueryString.prototype.toObject = function() {
  var queryString = this.extractQueryString(this._url);
  var parameters = this.parseQueryString(queryString);
  return parameters
}

QueryString.prototype.toUrl = function() {
  return this._baseUrl + '?' + QueryString.encode(this._parameters);
}

QueryString.prototype.extractQueryString = function(url) {
  var start = url.indexOf('?');
  var queryString = '';
  if(start != -1) {
    this._baseUrl = url.substring(0, start);

    start++;
    var end = url.indexOf('#');
    if(end == -1) {
      queryString = url.substring(start);
    } else {
      queryString = url.substring(start, end);
    }
  } else {
    this._baseUrl = url;
  }
  return queryString;
}

QueryString.prototype.parseQueryString = function(queryString) {
  var pairs = queryString.split('&');
  var parameters = {};
  function decode(x) {
    return decodeURIComponent(x.replace(/\+/g, " "));
  }
  for(var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var keyAndValue = pair.split('=');
    if(keyAndValue.length == 0) continue;
    var key = decode(keyAndValue[0]);
    if(key == "") continue;
    parameters[key] = parameters[key] || [];
    if(keyAndValue.length == 1) {
      parameters[key].push(null);
    } else {
      parameters[key].push(decode(keyAndValue[1]));
    }
  }
  return parameters;
}

QueryString.current = function() {
  return new QueryString(window.location.search);
}

QueryString.encode = function(object) {
  return jQuery.param(object);
}
