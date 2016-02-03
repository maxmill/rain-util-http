'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const _request = require('request');
const _methods = ['get', 'post', 'put', 'patch', 'head', 'del'];

// wrap request library as thunk-returning functions for co/koa use
function request(uri, options) {
    return callback => {
        _request(uri, options, (error, response, body) => {
            callback(error, response);
        });
    };
}
// copy request lib's properties
Object.keys(_request).forEach(attr => {
    request[attr] = _methods.indexOf(attr) > -1 ? (attr => (uri, options) => callback => {
        _request[attr](uri, options, (error, response, body) => {
            callback(error, response);
        });
    })(attr) : _request[attr];
});
/**
 *
 * @param url: base api url
 * @param headers: convenience param for common headers
 * @param opts: other request.js properties go here (httpSignature, multipart, headers)
 * */

module.exports = function () {
    for (var _len = arguments.length, opts = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        opts[_key - 2] = arguments[_key];
    }

    let url = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    let headers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var options = _extends({}, opts);

    options.headers = Object.assign(headers, options.headers || {});
    var apiRequest = request.defaults(options);
    var call = function call(method, path, body) {
        let requestHeaders = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

        var requestOptions = {
            url: url + path,
            headers: requestHeaders,
            method: method || 'GET',
            json: true
        };
        if (body) {
            requestOptions.body = body;
        }
        return apiRequest(requestOptions);
    };

    let out = {};
    _methods.forEach(m => {
        if (m.charAt(0) !== 'p') {
            let httpMethod = m === 'del' ? 'DELETE' : m.toUpperCase();
            out[m] = (url, headers) => call(httpMethod, url, headers);
        } else {
            out[m] = (url, body, headers) => call(m.toUpperCase(), url, body, headers);
        }
    });
    return out;
};