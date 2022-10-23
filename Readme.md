## Usage

- Build simple fake server with routing, params, static content
- GET, POST, PUT, DELETE, supported methods, status, bodies etc

![npm downloads](https://img.shields.io/npm/dm/post-get-service.svg?style=flat-square)

## Install

```sh
npm install -SD post-get-service || npm i -g post-get-service
```

## Example

base usage example

```js
const memoryPostGetService = require('post-get-service');
const model = {
  port: 9090,
  api: [
    {
      method: 'GET',
      path: '/',
      response: 'Hello world',
    },
  ],
};
memoryPostGetService(model).then(server => {
  setTimeout(() => {
    server.stop();
  }, 25000);
});
// open browser
// url 'http://localhost:9090/
```

mocha test example

```js
const memoryPostGetService = require('post-get-service');
const fetch = require('node-fetch');
const { expect } = require('chai');

const model = {
  port: 8888,
  api: [],
};
