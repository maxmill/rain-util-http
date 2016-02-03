const _request = require('request');
const _methods = ['get', 'post', 'put', 'patch', 'head', 'del'];

// wrap request library as thunk-returning functions for co/koa use
function request(uri, options) {
    return (callback) => {
        _request(uri, options, (error, response, body) => {
            callback(error, response);
        })
    }
}
// copy request lib's properties
Object.keys(_request).forEach((attr)=> {
    request[attr] = (_methods.indexOf(attr) > -1)
        ?
        ((attr) => (uri, options)=> (callback) => {
            _request[attr](uri, options, (error, response, body) => {
                callback(error, response);
            });
        })(attr)
        :
        _request[attr];
});
/**
 *
 * @param url: base api url
 * @param headers: convenience param for common headers
 * @param opts: other request.js properties go here (httpSignature, multipart, headers)
 * */

module.exports = (url = '', headers = {}, ...opts) => {
    var options = {...opts};

    options.headers = Object.assign(headers, options.headers || {});
    var apiRequest = request.defaults(options);
    var call = (method, path, body, requestHeaders = {}) => {
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
    _methods.forEach((m)=> {
        if (m.charAt(0) !== 'p') {
            let httpMethod = m === 'del' ? 'DELETE' : m.toUpperCase();
            out[m] = (url, headers) => call(httpMethod, url, headers);
        } else {
            out[m] = (url, body, headers) => call(m.toUpperCase(), url, body, headers);
        }
    });
    return out;
};
