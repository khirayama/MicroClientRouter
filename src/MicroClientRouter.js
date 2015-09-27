import pathToRegexp from 'path-to-regexp';

export default class MicroRouter {
  constructor() {
    this.setEventListeners();
    this._routes = [];
  }
  setEventListeners() {
    window.addEventListener('DOMContentLoaded', () => {
      this.emit(location.pathname);
    });
    window.addEventListener('pushstate', (event) => {
      event.preventDefault();
      this.emit(location.pathname);
    });
    window.addEventListener('popstate', (event) => {
      event.preventDefault();
      this.emit(location.pathname);
    });
  }
  route(path, callback) {
    let regexp = pathToRegexp(path);

    this._routes.push({ regexp: regexp, callback: callback});
  }
  emit(path) {
    window.history.pushState(null, null, path);
    for (let i = 0; i < this._routes.length; i++) {
      let r = this._routes[i];
      let reg;

      if (reg = r.regexp.exec(location.pathname)) {
        let callback = r.callback;
        let params = {};
        let keys = r.regexp.keys;
        let j;
        let n;

        for (j = 0, n = 0; j < keys.length; n = ++j) {
          let key = keys[n];
          params[key.name] = reg[n + 1];
        }
        callback(params);
      }
    }
  }
}
