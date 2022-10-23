// @ts-check
const { getRandomString } = require('sat-utils');
const { build_post_body, build_get_body } = require('./build_koa_router_model');
const { get_koa_request_method } = require('../commons');

/**
 * @param {string} path path
 * @returns {string}
 */
function common_template(path) {
  const variableName = getRandomString(25, { letters: true });

  const get_router_response = build_get_body(variableName);
  const post_router_response = build_post_body(variableName);

  const get_method = 'GET';
  const post_method = 'POST';

  const koa_get_method = get_koa_request_method(get_method);
  const koa_post_method = get_koa_request_method(post_method);

  return `

    const ${variableName} = [];

    router.${koa_post_method}('${path}', async (ctx) => {
      ${post_router_response}
    });

    router.${koa_get_method}('${path}', async (ctx) => {
      ${get_router_response}
    });`;
}

module.exports = {
  common_template,
};
