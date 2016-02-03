const test = require('tape-catch');
const coTape = require('co-tape');
const $http = require('../bin');
const testApi = {
    gmaps: new $http('https://maps.googleapis.com/', {'x-hi-there': 'hello'}),
    endPoint: new $http('http://jsonplaceholder.typicode.com/')
};

const assertResponse = function (t, response) {
    return response.body
        ? t.pass('HTTP ' + response.request.method + ' found response body' + ' (' + response.statusCode + ')')
        : t.fail('HTTP ' + response.request.method + ' missing response body' + ' (' + response.statusCode + ')');
};

test('HTTP GET ', coTape(function* (t) {
    var response = yield testApi.gmaps.get('maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA');
    assertResponse(t, response);
    t.end();
}));


test('HTTP GET 2x', coTape(function* (t) {
    var response = yield testApi.gmaps.get('maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA');
    var response2 = yield testApi.endPoint.get('posts/1');
    (response.body && response2.body)
        ? t.pass('HTTP GET 2x found response bodies' + ' (' + response.statusCode + ', ' + response2.statusCode + ')')
        : t.fail('HTTP GET 2x missing response bodies' + ' (' + response.statusCode + ', ' + response2.statusCode + ')');
    t.end();
}));


test('HTTP POST', coTape(function* (t) {
    var response = yield testApi.endPoint.post('posts/');
    assertResponse(t, response);
    t.end();
}));

test('HTTP PUT', coTape(function* (t) {
    var response = yield testApi.endPoint.put('posts/1', {
        title: 'test put'
    });
    assertResponse(t, response);
    t.end();
}));

test('HTTP PATCH', coTape(function* (t) {
    var response = yield testApi.endPoint.patch('posts/1', {
        title: 'test patch'
    });
    assertResponse(t, response);
    t.end();
}));
