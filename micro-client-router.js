(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.parse = parse;
exports.tokensToRegexp = tokensToRegexp;
exports.pathToRegexp = pathToRegexp;
exports._getParams = _getParams;
exports.exec = exec;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PATH_REGEXP = new RegExp(['(\\\\.)', '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');

function parse(str) {
  var tokens = [];
  var index = 0;
  var path = '';
  var res = undefined;

  /*eslint-disable */
  while ((res = PATH_REGEXP.exec(str)) !== null) {
    var offset = res.index;

    path += str.slice(index, offset);
    index = offset + res[0].length;

    // if not exist path or empty string
    if (path) {
      tokens.push(path);
    }
    path = '';

    var token = {
      name: res[3],
      pattern: '[^/]+?'
    };
    tokens.push(token);
  }
  /*eslint-enable */

  if (index < str.length) {
    path += str.substr(index);
  }
  if (path) {
    tokens.push(path);
  }

  return tokens;
}

function tokensToRegexp(tokens) {
  var route = '';
  var lastToken = tokens[tokens.length - 1];
  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

  tokens.forEach(function (token) {
    if (typeof token === 'string') {
      route += token;
    } else {
      var capture = token.pattern;

      capture = '/(' + capture + ')';
      route += capture;
    }
  });
  route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
  route += '$';

  return new RegExp('^' + route, 'i');
}

function pathToRegexp(path) {
  var tokens = parse(path);
  var regexp = tokensToRegexp(tokens);

  regexp.keys = [];
  tokens.forEach(function (token) {
    if (typeof token !== 'string') {
      regexp.keys.push(token);
    }
  });

  return regexp;
}

function _getParams(keys, matches) {
  var params = {};

  if (matches) {
    keys.forEach(function (key, index) {
      if (!params[key.name]) {
        params[key.name] = [];
      }
      params[key.name].push(matches[index + 1]);
    });
  }
  return params;
}

function exec(regexp, path) {
  var matches = regexp.exec(path);
  var params = _getParams(regexp.keys, matches);

  if (!matches) {
    return null;
  }

  matches.params = params;
  return matches;
}

var MicroClientRouter = (function () {
  function MicroClientRouter() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, MicroClientRouter);

    this._routes = [];

    if (options.onload) {
      this.setLoadHandler();
    }
    if (options.onpopstate) {
      this.setPopStateHandler();
    }
  }

  _createClass(MicroClientRouter, [{
    key: 'route',
    value: function route(path, callback) {
      var regexp = pathToRegexp(path);
      this._routes.push({ regexp: regexp, callback: callback });

      return this;
    }
  }, {
    key: 'emit',
    value: function emit(path) {
      this._routes.forEach(function (route) {
        var matches = exec(route.regexp, path);
        if (matches) {
          route.callback(matches.params);
        }
      });
    }
  }, {
    key: 'pushState',
    value: function pushState(state, title, url) {
      if (state === undefined) state = null;
      if (title === undefined) title = null;

      history.pushState(state, title, url);
      this.emit(url);
    }
  }, {
    key: 'setLoadHandler',
    value: function setLoadHandler(callback) {
      var _this = this;

      window.addEventListener('load', function () {
        if (callback) {
          callback();
        }
        _this.emit(location.pathname);
      });
    }
  }, {
    key: 'setPopStateHandler',
    value: function setPopStateHandler(callback) {
      var _this2 = this;

      window.addEventListener('popstate', function () {
        if (callback) {
          callback();
        }
        _this2.emit(location.pathname);
      });
    }
  }]);

  return MicroClientRouter;
})();

exports['default'] = MicroClientRouter;
},{}]},{},[1]);
