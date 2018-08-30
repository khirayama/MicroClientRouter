# MicroClientRouter
[![npm version](https://badge.fury.io/js/micro-client-router.svg)](https://badge.fury.io/js/micro-client-router)
[![CircleCI Status](https://img.shields.io/circleci/project/khirayama/micro-client-router/master.svg?style=flat&label=circle)](https://circleci.com/gh/khirayama/micro-client-router)

> A micro client router in es6.


## Motivation
I want to make a router without dependencies.


## Getting Started
Install the `npm` package:

```
$ npm install micro-client-router
```

Then import it via an es6 module:
```javascript
import MicroClientRouter from 'micro-client-router';
```

Or directly in the browser:

```html
<script src="node_modules/micro-client-router/micro-client-router.js"></script>
```


## API
It only has 5 methods!

**Basic API:**
- route
- emit

**Support API:**
- pushState
- setLoadHandler
- setPopStateHandler


### Initialization
```javascript
let router = new MicroClientRouter();
```

If you want to emit when load/popstate events are fired (use the `pushState()` method if you want to emit on pushstate events):

```javascript
let router = new MicroClientRouter({ onload: true, onpopstate: true });
```


### route
Adds a new route to the router.

```javascript
router.route('/posts', () => {
  // do somethong.
});
router.route('/posts/:id', ({ id }) => {
  // do somethong.
});
```

### emit
Causes the router to navigate to a new route.
```javascript
router.route('/posts/:id', (id) => {
  console.log(id); // 100
});

route.emit('/posts/100');
```

### pushState

```javascript
let $link = document.querySelector('a');

$link.addEventListener('click', (event) => {
  let url = event.target.href;
  route.pushState(null, null, url); // change url and run callback seted by route.
});
```

### setLoadHandler
Allows the execution of a method when the router has finished loading.
```javascript
route.setLoadHandler(() => {
  console.log('call this when onload.');
});
```

### setPopStateHandler
Adds an event listener that's fired on every `popstate` event.

```javascript
route.setPopStateHandler(() => {
  console.log('call this when onpopstate.');
});
```

## Example

```javascript
import MicroClientRouter from 'micro-client-router';

let router = new MicroClientRouter({ onload: true, onpopstate: true });

router.route('/posts', () => {
  // show posts.
});

router.route('/posts/:id', (id) => {
  // show a post.
});

let $link = document.querySelector('a');

$link.addEventListener('click', (event) => {
  let url = event.target.href;
  route.pushState(null, null, url); // change url and run callback set by the router.
});
```
