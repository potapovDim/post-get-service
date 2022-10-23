// @ts-check
const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

function require_module_from_string(src, filename = '') {
  const Module = module.constructor;
  // @ts-ignore
  const mod = new Module();
  mod._compile(src, filename);
  return mod.exports;
}

const { set_authorization_middleware } = require('./authorization');
const { get_routing_model } = require('../routing_templates');

module.exports = function (model) {
  const { debug } = model;

  const app = new Koa();
  app.use(bodyParser());
  app.use(cors());
  if (debug) {
    const logger = require('koa-logger');
    app.use(logger());
  }

  const routs = require_module_from_string(get_routing_model(model))(Router);

  // if fake server model contains authorization property
  // next execution will set koa-bearer-token middleware
  // @ts-ignore
  set_authorization_middleware(app, model);

  app.use(routs);

  return {
    app,
  };
};
