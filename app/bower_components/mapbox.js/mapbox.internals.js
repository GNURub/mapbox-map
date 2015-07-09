(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function corslite(url, callback, cors) {
    var sent = false;

    if (typeof window.XMLHttpRequest === 'undefined') {
        return callback(Error('Browser not supported'));
    }

    if (typeof cors === 'undefined') {
        var m = url.match(/^\s*https?:\/\/[^\/]*/);
        cors = m && (m[0] !== location.protocol + '//' + location.domain +
                (location.port ? ':' + location.port : ''));
    }

    var x = new window.XMLHttpRequest();

    function isSuccessful(status) {
        return status >= 200 && status < 300 || status === 304;
    }

    if (cors && !('withCredentials' in x)) {
        // IE8-9
        x = new window.XDomainRequest();

        // Ensure callback is never called synchronously, i.e., before
        // x.send() returns (this has been observed in the wild).
        // See https://github.com/mapbox/mapbox.js/issues/472
        var original = callback;
        callback = function() {
            if (sent) {
                original.apply(this, arguments);
            } else {
                var that = this, args = arguments;
                setTimeout(function() {
                    original.apply(that, args);
                }, 0);
            }
        }
    }

    function loaded() {
        if (
            // XDomainRequest
            x.status === undefined ||
            // modern browsers
            isSuccessful(x.status)) callback.call(x, null, x);
        else callback.call(x, x, null);
    }

    // Both `onreadystatechange` and `onload` can fire. `onreadystatechange`
    // has [been supported for longer](http://stackoverflow.com/a/9181508/229001).
    if ('onload' in x) {
        x.onload = loaded;
    } else {
        x.onreadystatechange = function readystate() {
            if (x.readyState === 4) {
                loaded();
            }
        };
    }

    // Call the callback with the XMLHttpRequest object as an error and prevent
    // it from ever being called again by reassigning it to `noop`
    x.onerror = function error(evt) {
        // XDomainRequest provides no evt parameter
        callback.call(this, evt || true, null);
        callback = function() { };
    };

    // IE9 must have onprogress be set to a unique function.
    x.onprogress = function() { };

    x.ontimeout = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    x.onabort = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    // GET is the only supported HTTP Verb by XDomainRequest and is the
    // only one supported here.
    x.open('GET', url, true);

    // Send the request. Sending data is not supported.
    x.send(null);
    sent = true;

    return x;
}

if (typeof module !== 'undefined') module.exports = corslite;

},{}],2:[function(require,module,exports){
module.exports={
  "author": "Mapbox",
  "name": "mapbox.js",
  "description": "mapbox javascript api",
  "version": "2.2.1",
  "homepage": "http://mapbox.com/",
  "repository": {
    "type": "git",
    "url": "git://github.com/mapbox/mapbox.js.git"
  },
  "main": "src/index.js",
  "dependencies": {
    "corslite": "0.0.6",
    "isarray": "0.0.1",
    "leaflet": "0.7.3",
    "mustache": "0.7.3",
    "sanitize-caja": "0.1.3"
  },
  "scripts": {
    "test": "eslint --no-eslintrc -c .eslintrc src && mocha-phantomjs test/index.html"
  },
  "devDependencies": {
    "browserify": "^6.3.2",
    "clean-css": "~2.0.7",
    "eslint": "^0.23.0",
    "expect.js": "0.3.1",
    "happen": "0.1.3",
    "leaflet-fullscreen": "0.0.4",
    "leaflet-hash": "0.2.1",
    "marked": "~0.3.0",
    "minifyify": "^6.1.0",
    "minimist": "0.0.5",
    "mocha": "1.17.1",
    "mocha-phantomjs": "3.1.6",
    "sinon": "1.10.2"
  },
  "optionalDependencies": {},
  "engines": {
    "node": "*"
  }
}

},{}],3:[function(require,module,exports){
'use strict';

module.exports = {
    HTTP_URL: 'http://a.tiles.mapbox.com/v4',
    HTTPS_URL: 'https://a.tiles.mapbox.com/v4',
    FORCE_HTTPS: false,
    REQUIRE_ACCESS_TOKEN: true
};

},{}],4:[function(require,module,exports){
'use strict';

function utfDecode(c) {
    if (c >= 93) c--;
    if (c >= 35) c--;
    return c - 32;
}

module.exports = function(data) {
    return function(x, y) {
        if (!data) return;
        var idx = utfDecode(data.grid[y].charCodeAt(x)),
            key = data.keys[idx];
        return data.data[key];
    };
};

},{}],5:[function(require,module,exports){
window.internals = {
    url: require('./url'),
    config: require('./config'),
    util: require('./util'),
    grid: require('./grid'),
    request: require('./request')
};

},{"./config":3,"./grid":4,"./request":6,"./url":7,"./util":8}],6:[function(require,module,exports){
'use strict';

var corslite = require('corslite'),
    strict = require('./util').strict,
    config = require('./config');

var protocol = /^(https?:)?(?=\/\/(.|api)\.tiles\.mapbox\.com\/)/;

module.exports = function(url, callback) {
    strict(url, 'string');
    strict(callback, 'function');

    url = url.replace(protocol, function(match, protocol) {
        if (!('withCredentials' in new window.XMLHttpRequest())) {
            // XDomainRequest in use; doesn't support cross-protocol requests
            return document.location.protocol;
        } else if (protocol === 'https:' || document.location.protocol === 'https:' || config.FORCE_HTTPS) {
            return 'https:';
        } else {
            return 'http:';
        }
    });

    function onload(err, resp) {
        if (!err && resp) {
            resp = JSON.parse(resp.responseText);
        }
        callback(err, resp);
    }

    return corslite(url, onload);
};

},{"./config":3,"./util":8,"corslite":1}],7:[function(require,module,exports){
'use strict';

var config = require('./config'),
    version = require('../package.json').version;

module.exports = function(path, accessToken) {
    accessToken = accessToken || L.mapbox.accessToken;

    if (!accessToken && config.REQUIRE_ACCESS_TOKEN) {
        throw new Error('An API access token is required to use Mapbox.js. ' +
            'See https://www.mapbox.com/mapbox.js/api/v' + version + '/api-access-tokens/');
    }

    var url = (document.location.protocol === 'https:' || config.FORCE_HTTPS) ? config.HTTPS_URL : config.HTTP_URL;
    url += path;
    url += url.indexOf('?') !== -1 ? '&access_token=' : '?access_token=';

    if (config.REQUIRE_ACCESS_TOKEN) {
        if (accessToken[0] === 's') {
            throw new Error('Use a public access token (pk.*) with Mapbox.js, not a secret access token (sk.*). ' +
                'See https://www.mapbox.com/mapbox.js/api/v' + version + '/api-access-tokens/');
        }

        url += accessToken;
    }

    return url;
};

module.exports.tileJSON = function(urlOrMapID, accessToken) {
    if (urlOrMapID.indexOf('/') !== -1)
        return urlOrMapID;

    var url = module.exports('/' + urlOrMapID + '.json', accessToken);

    // TileJSON requests need a secure flag appended to their URLs so
    // that the server knows to send SSL-ified resource references.
    if (url.indexOf('https') === 0)
        url += '&secure';

    return url;
};

},{"../package.json":2,"./config":3}],8:[function(require,module,exports){
'use strict';

function contains(item, list) {
    if (!list || !list.length) return false;
    for (var i = 0; i < list.length; i++) {
        if (list[i] === item) return true;
    }
    return false;
}

module.exports = {
    idUrl: function(_, t) {
        if (_.indexOf('/') === -1) t.loadID(_);
        else t.loadURL(_);
    },
    log: function(_) {
        if (typeof console === 'object' &&
            typeof console.error === 'function') {
            console.error(_);
        }
    },
    strict: function(_, type) {
        if (typeof _ !== type) {
            throw new Error('Invalid argument: ' + type + ' expected');
        }
    },
    strict_instance: function(_, klass, name) {
        if (!(_ instanceof klass)) {
            throw new Error('Invalid argument: ' + name + ' expected');
        }
    },
    strict_oneof: function(_, values) {
        if (!contains(_, values)) {
            throw new Error('Invalid argument: ' + _ + ' given, valid values are ' +
                values.join(', '));
        }
    },
    strip_tags: function(_) {
        return _.replace(/<[^<]+>/g, '');
    },
    lbounds: function(_) {
        // leaflet-compatible bounds, since leaflet does not do geojson
        return new L.LatLngBounds([[_[1], _[0]], [_[3], _[2]]]);
    }
};

},{}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yc2xpdGUvY29yc2xpdGUuanMiLCJwYWNrYWdlLmpzb24iLCJzcmMvY29uZmlnLmpzIiwic3JjL2dyaWQuanMiLCJzcmMvaW50ZXJuYWxzLmpzIiwic3JjL3JlcXVlc3QuanMiLCJzcmMvdXJsLmpzIiwic3JjL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBjb3JzbGl0ZSh1cmwsIGNhbGxiYWNrLCBjb3JzKSB7XG4gICAgdmFyIHNlbnQgPSBmYWxzZTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93LlhNTEh0dHBSZXF1ZXN0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soRXJyb3IoJ0Jyb3dzZXIgbm90IHN1cHBvcnRlZCcpKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvcnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBtID0gdXJsLm1hdGNoKC9eXFxzKmh0dHBzPzpcXC9cXC9bXlxcL10qLyk7XG4gICAgICAgIGNvcnMgPSBtICYmIChtWzBdICE9PSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5kb21haW4gK1xuICAgICAgICAgICAgICAgIChsb2NhdGlvbi5wb3J0ID8gJzonICsgbG9jYXRpb24ucG9ydCA6ICcnKSk7XG4gICAgfVxuXG4gICAgdmFyIHggPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICBmdW5jdGlvbiBpc1N1Y2Nlc3NmdWwoc3RhdHVzKSB7XG4gICAgICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCB8fCBzdGF0dXMgPT09IDMwNDtcbiAgICB9XG5cbiAgICBpZiAoY29ycyAmJiAhKCd3aXRoQ3JlZGVudGlhbHMnIGluIHgpKSB7XG4gICAgICAgIC8vIElFOC05XG4gICAgICAgIHggPSBuZXcgd2luZG93LlhEb21haW5SZXF1ZXN0KCk7XG5cbiAgICAgICAgLy8gRW5zdXJlIGNhbGxiYWNrIGlzIG5ldmVyIGNhbGxlZCBzeW5jaHJvbm91c2x5LCBpLmUuLCBiZWZvcmVcbiAgICAgICAgLy8geC5zZW5kKCkgcmV0dXJucyAodGhpcyBoYXMgYmVlbiBvYnNlcnZlZCBpbiB0aGUgd2lsZCkuXG4gICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWFwYm94L21hcGJveC5qcy9pc3N1ZXMvNDcyXG4gICAgICAgIHZhciBvcmlnaW5hbCA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHNlbnQpIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWwuYXBwbHkodGhhdCwgYXJncyk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkZWQoKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIC8vIFhEb21haW5SZXF1ZXN0XG4gICAgICAgICAgICB4LnN0YXR1cyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAvLyBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgICAgIGlzU3VjY2Vzc2Z1bCh4LnN0YXR1cykpIGNhbGxiYWNrLmNhbGwoeCwgbnVsbCwgeCk7XG4gICAgICAgIGVsc2UgY2FsbGJhY2suY2FsbCh4LCB4LCBudWxsKTtcbiAgICB9XG5cbiAgICAvLyBCb3RoIGBvbnJlYWR5c3RhdGVjaGFuZ2VgIGFuZCBgb25sb2FkYCBjYW4gZmlyZS4gYG9ucmVhZHlzdGF0ZWNoYW5nZWBcbiAgICAvLyBoYXMgW2JlZW4gc3VwcG9ydGVkIGZvciBsb25nZXJdKGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzkxODE1MDgvMjI5MDAxKS5cbiAgICBpZiAoJ29ubG9hZCcgaW4geCkge1xuICAgICAgICB4Lm9ubG9hZCA9IGxvYWRlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB4Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIHJlYWR5c3RhdGUoKSB7XG4gICAgICAgICAgICBpZiAoeC5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICAgICAgbG9hZGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2sgd2l0aCB0aGUgWE1MSHR0cFJlcXVlc3Qgb2JqZWN0IGFzIGFuIGVycm9yIGFuZCBwcmV2ZW50XG4gICAgLy8gaXQgZnJvbSBldmVyIGJlaW5nIGNhbGxlZCBhZ2FpbiBieSByZWFzc2lnbmluZyBpdCB0byBgbm9vcGBcbiAgICB4Lm9uZXJyb3IgPSBmdW5jdGlvbiBlcnJvcihldnQpIHtcbiAgICAgICAgLy8gWERvbWFpblJlcXVlc3QgcHJvdmlkZXMgbm8gZXZ0IHBhcmFtZXRlclxuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGV2dCB8fCB0cnVlLCBudWxsKTtcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHsgfTtcbiAgICB9O1xuXG4gICAgLy8gSUU5IG11c3QgaGF2ZSBvbnByb2dyZXNzIGJlIHNldCB0byBhIHVuaXF1ZSBmdW5jdGlvbi5cbiAgICB4Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHsgfTtcblxuICAgIHgub250aW1lb3V0ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgZXZ0LCBudWxsKTtcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHsgfTtcbiAgICB9O1xuXG4gICAgeC5vbmFib3J0ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgZXZ0LCBudWxsKTtcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHsgfTtcbiAgICB9O1xuXG4gICAgLy8gR0VUIGlzIHRoZSBvbmx5IHN1cHBvcnRlZCBIVFRQIFZlcmIgYnkgWERvbWFpblJlcXVlc3QgYW5kIGlzIHRoZVxuICAgIC8vIG9ubHkgb25lIHN1cHBvcnRlZCBoZXJlLlxuICAgIHgub3BlbignR0VUJywgdXJsLCB0cnVlKTtcblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3QuIFNlbmRpbmcgZGF0YSBpcyBub3Qgc3VwcG9ydGVkLlxuICAgIHguc2VuZChudWxsKTtcbiAgICBzZW50ID0gdHJ1ZTtcblxuICAgIHJldHVybiB4O1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gY29yc2xpdGU7XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwiYXV0aG9yXCI6IFwiTWFwYm94XCIsXG4gIFwibmFtZVwiOiBcIm1hcGJveC5qc1wiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwibWFwYm94IGphdmFzY3JpcHQgYXBpXCIsXG4gIFwidmVyc2lvblwiOiBcIjIuMi4xXCIsXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwOi8vbWFwYm94LmNvbS9cIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdDovL2dpdGh1Yi5jb20vbWFwYm94L21hcGJveC5qcy5naXRcIlxuICB9LFxuICBcIm1haW5cIjogXCJzcmMvaW5kZXguanNcIixcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiY29yc2xpdGVcIjogXCIwLjAuNlwiLFxuICAgIFwiaXNhcnJheVwiOiBcIjAuMC4xXCIsXG4gICAgXCJsZWFmbGV0XCI6IFwiMC43LjNcIixcbiAgICBcIm11c3RhY2hlXCI6IFwiMC43LjNcIixcbiAgICBcInNhbml0aXplLWNhamFcIjogXCIwLjEuM1wiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJ0ZXN0XCI6IFwiZXNsaW50IC0tbm8tZXNsaW50cmMgLWMgLmVzbGludHJjIHNyYyAmJiBtb2NoYS1waGFudG9tanMgdGVzdC9pbmRleC5odG1sXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYnJvd3NlcmlmeVwiOiBcIl42LjMuMlwiLFxuICAgIFwiY2xlYW4tY3NzXCI6IFwifjIuMC43XCIsXG4gICAgXCJlc2xpbnRcIjogXCJeMC4yMy4wXCIsXG4gICAgXCJleHBlY3QuanNcIjogXCIwLjMuMVwiLFxuICAgIFwiaGFwcGVuXCI6IFwiMC4xLjNcIixcbiAgICBcImxlYWZsZXQtZnVsbHNjcmVlblwiOiBcIjAuMC40XCIsXG4gICAgXCJsZWFmbGV0LWhhc2hcIjogXCIwLjIuMVwiLFxuICAgIFwibWFya2VkXCI6IFwifjAuMy4wXCIsXG4gICAgXCJtaW5pZnlpZnlcIjogXCJeNi4xLjBcIixcbiAgICBcIm1pbmltaXN0XCI6IFwiMC4wLjVcIixcbiAgICBcIm1vY2hhXCI6IFwiMS4xNy4xXCIsXG4gICAgXCJtb2NoYS1waGFudG9tanNcIjogXCIzLjEuNlwiLFxuICAgIFwic2lub25cIjogXCIxLjEwLjJcIlxuICB9LFxuICBcIm9wdGlvbmFsRGVwZW5kZW5jaWVzXCI6IHt9LFxuICBcImVuZ2luZXNcIjoge1xuICAgIFwibm9kZVwiOiBcIipcIlxuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEhUVFBfVVJMOiAnaHR0cDovL2EudGlsZXMubWFwYm94LmNvbS92NCcsXG4gICAgSFRUUFNfVVJMOiAnaHR0cHM6Ly9hLnRpbGVzLm1hcGJveC5jb20vdjQnLFxuICAgIEZPUkNFX0hUVFBTOiBmYWxzZSxcbiAgICBSRVFVSVJFX0FDQ0VTU19UT0tFTjogdHJ1ZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gdXRmRGVjb2RlKGMpIHtcbiAgICBpZiAoYyA+PSA5MykgYy0tO1xuICAgIGlmIChjID49IDM1KSBjLS07XG4gICAgcmV0dXJuIGMgLSAzMjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgaWYgKCFkYXRhKSByZXR1cm47XG4gICAgICAgIHZhciBpZHggPSB1dGZEZWNvZGUoZGF0YS5ncmlkW3ldLmNoYXJDb2RlQXQoeCkpLFxuICAgICAgICAgICAga2V5ID0gZGF0YS5rZXlzW2lkeF07XG4gICAgICAgIHJldHVybiBkYXRhLmRhdGFba2V5XTtcbiAgICB9O1xufTtcbiIsIndpbmRvdy5pbnRlcm5hbHMgPSB7XG4gICAgdXJsOiByZXF1aXJlKCcuL3VybCcpLFxuICAgIGNvbmZpZzogcmVxdWlyZSgnLi9jb25maWcnKSxcbiAgICB1dGlsOiByZXF1aXJlKCcuL3V0aWwnKSxcbiAgICBncmlkOiByZXF1aXJlKCcuL2dyaWQnKSxcbiAgICByZXF1ZXN0OiByZXF1aXJlKCcuL3JlcXVlc3QnKVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNvcnNsaXRlID0gcmVxdWlyZSgnY29yc2xpdGUnKSxcbiAgICBzdHJpY3QgPSByZXF1aXJlKCcuL3V0aWwnKS5zdHJpY3QsXG4gICAgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKTtcblxudmFyIHByb3RvY29sID0gL14oaHR0cHM/Oik/KD89XFwvXFwvKC58YXBpKVxcLnRpbGVzXFwubWFwYm94XFwuY29tXFwvKS87XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsLCBjYWxsYmFjaykge1xuICAgIHN0cmljdCh1cmwsICdzdHJpbmcnKTtcbiAgICBzdHJpY3QoY2FsbGJhY2ssICdmdW5jdGlvbicpO1xuXG4gICAgdXJsID0gdXJsLnJlcGxhY2UocHJvdG9jb2wsIGZ1bmN0aW9uKG1hdGNoLCBwcm90b2NvbCkge1xuICAgICAgICBpZiAoISgnd2l0aENyZWRlbnRpYWxzJyBpbiBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KCkpKSB7XG4gICAgICAgICAgICAvLyBYRG9tYWluUmVxdWVzdCBpbiB1c2U7IGRvZXNuJ3Qgc3VwcG9ydCBjcm9zcy1wcm90b2NvbCByZXF1ZXN0c1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sO1xuICAgICAgICB9IGVsc2UgaWYgKHByb3RvY29sID09PSAnaHR0cHM6JyB8fCBkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHBzOicgfHwgY29uZmlnLkZPUkNFX0hUVFBTKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2h0dHBzOic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJ2h0dHA6JztcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gb25sb2FkKGVyciwgcmVzcCkge1xuICAgICAgICBpZiAoIWVyciAmJiByZXNwKSB7XG4gICAgICAgICAgICByZXNwID0gSlNPTi5wYXJzZShyZXNwLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXNwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29yc2xpdGUodXJsLCBvbmxvYWQpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJyksXG4gICAgdmVyc2lvbiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb247XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocGF0aCwgYWNjZXNzVG9rZW4pIHtcbiAgICBhY2Nlc3NUb2tlbiA9IGFjY2Vzc1Rva2VuIHx8IEwubWFwYm94LmFjY2Vzc1Rva2VuO1xuXG4gICAgaWYgKCFhY2Nlc3NUb2tlbiAmJiBjb25maWcuUkVRVUlSRV9BQ0NFU1NfVE9LRU4pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbiBBUEkgYWNjZXNzIHRva2VuIGlzIHJlcXVpcmVkIHRvIHVzZSBNYXBib3guanMuICcgK1xuICAgICAgICAgICAgJ1NlZSBodHRwczovL3d3dy5tYXBib3guY29tL21hcGJveC5qcy9hcGkvdicgKyB2ZXJzaW9uICsgJy9hcGktYWNjZXNzLXRva2Vucy8nKTtcbiAgICB9XG5cbiAgICB2YXIgdXJsID0gKGRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cHM6JyB8fCBjb25maWcuRk9SQ0VfSFRUUFMpID8gY29uZmlnLkhUVFBTX1VSTCA6IGNvbmZpZy5IVFRQX1VSTDtcbiAgICB1cmwgKz0gcGF0aDtcbiAgICB1cmwgKz0gdXJsLmluZGV4T2YoJz8nKSAhPT0gLTEgPyAnJmFjY2Vzc190b2tlbj0nIDogJz9hY2Nlc3NfdG9rZW49JztcblxuICAgIGlmIChjb25maWcuUkVRVUlSRV9BQ0NFU1NfVE9LRU4pIHtcbiAgICAgICAgaWYgKGFjY2Vzc1Rva2VuWzBdID09PSAncycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVXNlIGEgcHVibGljIGFjY2VzcyB0b2tlbiAocGsuKikgd2l0aCBNYXBib3guanMsIG5vdCBhIHNlY3JldCBhY2Nlc3MgdG9rZW4gKHNrLiopLiAnICtcbiAgICAgICAgICAgICAgICAnU2VlIGh0dHBzOi8vd3d3Lm1hcGJveC5jb20vbWFwYm94LmpzL2FwaS92JyArIHZlcnNpb24gKyAnL2FwaS1hY2Nlc3MtdG9rZW5zLycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdXJsICs9IGFjY2Vzc1Rva2VuO1xuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy50aWxlSlNPTiA9IGZ1bmN0aW9uKHVybE9yTWFwSUQsIGFjY2Vzc1Rva2VuKSB7XG4gICAgaWYgKHVybE9yTWFwSUQuaW5kZXhPZignLycpICE9PSAtMSlcbiAgICAgICAgcmV0dXJuIHVybE9yTWFwSUQ7XG5cbiAgICB2YXIgdXJsID0gbW9kdWxlLmV4cG9ydHMoJy8nICsgdXJsT3JNYXBJRCArICcuanNvbicsIGFjY2Vzc1Rva2VuKTtcblxuICAgIC8vIFRpbGVKU09OIHJlcXVlc3RzIG5lZWQgYSBzZWN1cmUgZmxhZyBhcHBlbmRlZCB0byB0aGVpciBVUkxzIHNvXG4gICAgLy8gdGhhdCB0aGUgc2VydmVyIGtub3dzIHRvIHNlbmQgU1NMLWlmaWVkIHJlc291cmNlIHJlZmVyZW5jZXMuXG4gICAgaWYgKHVybC5pbmRleE9mKCdodHRwcycpID09PSAwKVxuICAgICAgICB1cmwgKz0gJyZzZWN1cmUnO1xuXG4gICAgcmV0dXJuIHVybDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGNvbnRhaW5zKGl0ZW0sIGxpc3QpIHtcbiAgICBpZiAoIWxpc3QgfHwgIWxpc3QubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChsaXN0W2ldID09PSBpdGVtKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpZFVybDogZnVuY3Rpb24oXywgdCkge1xuICAgICAgICBpZiAoXy5pbmRleE9mKCcvJykgPT09IC0xKSB0LmxvYWRJRChfKTtcbiAgICAgICAgZWxzZSB0LmxvYWRVUkwoXyk7XG4gICAgfSxcbiAgICBsb2c6IGZ1bmN0aW9uKF8pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgdHlwZW9mIGNvbnNvbGUuZXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHN0cmljdDogZnVuY3Rpb24oXywgdHlwZSkge1xuICAgICAgICBpZiAodHlwZW9mIF8gIT09IHR5cGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcmd1bWVudDogJyArIHR5cGUgKyAnIGV4cGVjdGVkJyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHN0cmljdF9pbnN0YW5jZTogZnVuY3Rpb24oXywga2xhc3MsIG5hbWUpIHtcbiAgICAgICAgaWYgKCEoXyBpbnN0YW5jZW9mIGtsYXNzKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50OiAnICsgbmFtZSArICcgZXhwZWN0ZWQnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc3RyaWN0X29uZW9mOiBmdW5jdGlvbihfLCB2YWx1ZXMpIHtcbiAgICAgICAgaWYgKCFjb250YWlucyhfLCB2YWx1ZXMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQ6ICcgKyBfICsgJyBnaXZlbiwgdmFsaWQgdmFsdWVzIGFyZSAnICtcbiAgICAgICAgICAgICAgICB2YWx1ZXMuam9pbignLCAnKSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHN0cmlwX3RhZ3M6IGZ1bmN0aW9uKF8pIHtcbiAgICAgICAgcmV0dXJuIF8ucmVwbGFjZSgvPFtePF0rPi9nLCAnJyk7XG4gICAgfSxcbiAgICBsYm91bmRzOiBmdW5jdGlvbihfKSB7XG4gICAgICAgIC8vIGxlYWZsZXQtY29tcGF0aWJsZSBib3VuZHMsIHNpbmNlIGxlYWZsZXQgZG9lcyBub3QgZG8gZ2VvanNvblxuICAgICAgICByZXR1cm4gbmV3IEwuTGF0TG5nQm91bmRzKFtbX1sxXSwgX1swXV0sIFtfWzNdLCBfWzJdXV0pO1xuICAgIH1cbn07XG4iXX0=
