# MicroClientRouter
[![npm version](https://badge.fury.io/js/micro-client-router.svg)](https://badge.fury.io/js/micro-client-router)
[![CircleCI Status](https://img.shields.io/circleci/project/khirayama/micro-client-router/master.svg?style=flat&label=circle)](https://circleci.com/gh/khirayama/micro-client-router)  
micro client router in es6.

## Motivation
I want to make a router without dependencies.

## Getting Started

```
$ npm install micro-clinet-router
```

```javascript
import MicroClientRouter from 'micro-client-router';
```

```html
<script src="micro-client-router.js"></script>
```

## API
It has 5 API only.

Basic API
- route
- emit

Support API
- pushState
- setLoadHandler
- setPopStateHandler

### initialize

```javascript
let router = new MicroClientRouter();
```

if you want to emit when load/popstate events.
(use pushState method, you want to emit when pushstate events.)

```javascript
let router = new MicroClientRouter({ onload: true, onpopstate: true });
```

### route

```javascript
router.route('/posts', () => {
  // do somethong.
});
router.route('/posts/:id', ({ id }) => {
  // do somethong.
});
```

### emit

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

```javascript
route.setLoadHandler(() => {
  console.log('call this when onload.');
});
```

### setPopStateHandler

```javascript
route.setLoadHandler(() => {
  console.log('call this when onpopstate.');
});
```

## Examples

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
  route.pushState(null, null, url); // change url and run callback seted by route.
});
```
