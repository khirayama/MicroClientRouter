import assert from 'power-assert';
import MicroRouter, { parse, tokensToRegexp, pathToRegexp, exec } from '../src/';

describe('MicroRouter', () => {

  describe('Router', () => {
    let router;
    let routes;

    beforeEach(() => {
      router = new MicroRouter();
      routes = router._routes;
    });
    describe('route', () => {
      it('register', () => {
        router.route('/posts/:id', ({ id }) => {
        });
        assert(routes.length === 1);
      });
    });
    describe('emit', () => {
      it('emit', (done) => {
        router.route('/posts/:id', ({ id }) => {
          assert(id[0] === "100");
          done();
        });
        router.emit('/posts/100');
        assert(routes.length === 1);
      });
    });
  });

  describe('parse', () => {
    it('posts', () => {
      let tokens = parse('/posts');

      assert(tokens.length === 1);
      assert(tokens[0] === '/posts');
    });
    it('posts/:id', () => {
      let tokens = parse('/posts/:id');

      assert(tokens.length === 2);
      assert(tokens[0] === '/posts');
      assert(tokens[1].name === 'id');
    });
    it('posts/:id/edit', () => {
      let tokens = parse('/posts/:id/edit');

      assert(tokens.length === 3);
      assert(tokens[0] === '/posts');
      assert(tokens[1].name === 'id');
      assert(tokens[2] === '/edit');
    });
    it('posts/:id/:status', () => {
      let tokens = parse('/posts/:id/:status');

      assert(tokens.length === 3);
      assert(tokens[0] === '/posts');
      assert(tokens[1].name === 'id');
      assert(tokens[2].name === 'status');
    });
  });
  describe('tokensToRegexp', () => {
    it('/posts/:id', () => {
      let tokens = parse('/posts/:id');
      let regexp = tokensToRegexp(tokens);

      assert(regexp.constructor.name === 'RegExp');
    });
  });
  describe('pathToRegexp', () => {
    it('/posts/:id', () => {
      let result = pathToRegexp('/posts/:id');

      assert(result.constructor.name === 'RegExp');
      assert(result.keys.length === 1);
      assert(result.keys[0].name === 'id');
    });
    it('/posts/:id/:status', () => {
      let result = pathToRegexp('/posts/:id/:status');

      assert(result.constructor.name === 'RegExp');
      assert(result.keys.length === 2);
      assert(result.keys[0].name === 'id');
      assert(result.keys[1].name === 'status');
    });
    it('/posts/:id/:id', () => {
      let result = pathToRegexp('/posts/:id/:id');

      assert(result.constructor.name === 'RegExp');
      assert(result.keys.length === 2);
      assert(result.keys[0].name === 'id');
      assert(result.keys[1].name === 'id');
    });
  });
  describe('exec', () => {
    it('/posts', () => {
      let result = pathToRegexp('/posts');
      let matches = exec(result, '/posts');

      assert(Object.keys(matches.params).length === 0);
    });
    it('/posts/:id', () => {
      let result = pathToRegexp('/posts/:id');
      let matches = exec(result, '/posts/100');

      assert(matches.params.id[0] === '100');
    });
    it('/posts/:id/edit', () => {
      let result = pathToRegexp('/posts/:id/edit');
      let matches = exec(result, '/posts/100/edit');

      assert(matches.params.id[0] === '100');
    });
    it('/posts/:id/:status', () => {
      let result = pathToRegexp('/posts/:id/:status');
      let matches = exec(result, '/posts/100/001');

      assert(matches.params.id[0] === '100');
      assert(matches.params.status[0] === '001');
    });
    it('/posts/:id/:id', () => {
      let result = pathToRegexp('/posts/:id/:id');
      let matches = exec(result, '/posts/100/001');

      assert(matches.params.id[0] === '100');
      assert(matches.params.id[1] === '001');
    });
    it('/posts/:id/edit to /posts/:id', () => {
      let result = pathToRegexp('/posts/:id');
      let matches = exec(result, '/posts/100/edit');

      assert(matches === null);
    });
  });
});
