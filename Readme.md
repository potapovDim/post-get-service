## Usage

- Build simple in memory HTTP server
- GET, POST are supported methods.

![npm downloads](https://img.shields.io/npm/dm/post-get-service.svg?style=flat-square)

## Install

```sh
npm install -SD post-get-service || npm i -g post-get-service
```

## Example

base usage example

```js
const { run_service, generate_api_requests } = require('post-get-service');

const model = {
  port: 8081,
  api: [
    {
      path: '/user',
    },
    {
      path: '/item',
    },
  ],
};

example();
async function example() {
  generate_api_requests(model, 'js', './interactions.js');
  const service = await run_service(model);
  const { create_data_user, get_data_user } = require('./interactions.js');

  await create_data_user({ user: 1 });
  await create_data_user({ user: 2 });
  await create_data_user({ user: 3 });
  await create_data_user({ user: 4 });

  const user = await get_data_user();
  console.log(user); // { user: 1 }

  await service.stop();
}
```
