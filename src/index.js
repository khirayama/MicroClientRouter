export default class MicroClientRouter {
  constructor(options = {}) {
    this._routes = [];

    if (options.onload) {
      this.setLoadHandler();
    }
    if (options.onpopstate) {
      this.setPopStateHandler();
    }
  }

  route(path, callback) {
    let regexp = pathToRegexp(path);
    this._routes.push({ regexp, callback });

    return this;
  }

  emit(path) {
    this._routes.forEach((route) => {
      let matches = exec(route.regexp, path);
      if (matches) {
        route.callback(matches.params);
      }
    });
  }

  pushState(state = null, title = null, url) {
    history.pushState(state, title, url);
    this.emit(url);
  }

  setLoadHandler() {
    window.addEventListener('load', () => {
      this.emit(location.pathname);
    });
  }

  setPopStateHandler() {
    window.addEventListener('popstate', () => {
      this.emit(location.pathname);
    });
  }
}

const PATH_REGEXP = new RegExp([
  '(\\\\.)',
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))',
].join('|'), 'g');

export function parse(str) {
  const tokens = [];
  let index = 0;
  let path = '';
  let res;

  /*eslint-disable */
  while ((res = PATH_REGEXP.exec(str)) !== null) {
    let offset = res.index;

    path += str.slice(index, offset);
    index = offset + res[0].length;

    // if not exist path or empty string
    if (path) {
      tokens.push(path);
    }
    path = '';

    const token = {
      name: res[3],
      pattern: '[^/]+?',
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

export function tokensToRegexp(tokens) {
  let route = '';
  const lastToken = tokens[tokens.length - 1];
  const endsWithSlash = (typeof lastToken === 'string' && /\/$/.test(lastToken));

  tokens.forEach((token) => {
    if (typeof token === 'string') {
      route += token;
    } else {
      let capture = token.pattern;

      capture = '/(' + capture + ')';
      route += capture;
    }
  });
  route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
  route += '$';

  return new RegExp('^' + route, 'i');
}

export function pathToRegexp(path) {
  const tokens = parse(path);
  const regexp = tokensToRegexp(tokens);

  regexp.keys = [];
  tokens.forEach((token) => {
    if (typeof token !== 'string') {
      regexp.keys.push(token);
    }
  });

  return regexp;
}

export function _getParams(keys, matches) {
  const params = {};

  if (matches) {
    keys.forEach((key, index) => {
      if (!params[key.name]) {
        params[key.name] = [];
      }
      params[key.name].push(matches[index + 1]);
    });
  }
  return params;
}

export function exec(regexp, path) {
  const matches = regexp.exec(path);
  const params = _getParams(regexp.keys, matches);

  if (!matches) {
    return null;
  }

  matches.params = params;
  return matches;
}
