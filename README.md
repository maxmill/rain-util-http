# rain-util-http #

[![Build Status](https://travis-ci.org/maxmill/rain-util-http.svg?style=flat-square)](https://travis-ci.org/maxmill/rain-util-http)
[![npm](https://img.shields.io/npm/v/rain-util-http.svg?style=flat-square)]()
[![npm](https://img.shields.io/npm/dt/rain-util-http.svg)]()


Simplistic generator based utility for consuming apis and making easy http requests

```
npm i rain-util
var $util = require('rain-util');
```

### http requests ###
extends request.js additional properties may be passed as params  (httpSignature, multipart, headers)
```
var api = new $util.http('https://maps.googleapis.com/');
var api2 = new $util.http('https://my.api.com/',
  { 'x-default-header':'its value'},
  {httpSignature:{keyId:'rsa-key-1',algorithm='rsa-sha256',signature:'Base64(RSA-SHA256(signing string))'}
);

var req = new $util.http();

var apiResponse = yield mapsApi.get('maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA');
console.log('apiResponse',apiResponse);
req.get('full url');

var api2Response = yield api2.post('another url', requestBody);
```

### credits ###

- https://github.com/request/request
- https://github.com/substack/tape
