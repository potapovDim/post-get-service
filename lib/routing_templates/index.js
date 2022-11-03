const { common_template } = require('./common_template');

/**
 * @param {object}  jsom_model object
 * @returns {string} return string with KOA routing model
 */

function get_routing_model(jsom_model) {
  const temp_model = JSON.stringify(jsom_model);
  const top_base =
    'function router_worker (Router, request, deep_equal) {' +
    'const fs = require("fs") \n' +
    'const path = require("path") \n' +
    'const querystring = require("querystring") \n' +
    `// temp_model ${temp_model} \n` +
    'const router = new Router()';

  const bottom_base = '\n module.exports = router_worker;  \n'; //router.routes()
  const { api } = jsom_model;

  const live_check = `
  \n
    router.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = { live: true };
      return ctx;
    });
  \n
  `;

  const routing_model = api.reduce((current_model, { path }) => {
    const koa_rout_executor = common_template(path);

    current_model += '\n' + koa_rout_executor;

    return current_model;
  }, '');

  return top_base + routing_model + live_check + '\n return router.routes()}' + bottom_base;
}

module.exports = {
  get_routing_model,
};
