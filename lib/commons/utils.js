// @ts-check
const path = require('path');
const { isString } = require('sat-utils');

const methods_map = {
  POST: 'post',
  GET: 'get',
  PUT: 'put',
  DELETE: 'del',
  PATCH: 'patch',
};

/**
 * @param {string}  http_method one of HTTP methods POST,PUT,GET,DELETE
 * @returns {string} returns KOA router or request method one of post,get,put,gel
 * @throws exception if method does not supported
 */
function get_koa_request_method(http_method) {
  const method = methods_map[http_method];
  if (method) return method;
  throw new Error(`"${http_method}" method is not supported`);
}

function get_model_file_path(file_path_or_object) {
  if (isString(file_path_or_object)) {
    if (path.isAbsolute(file_path_or_object)) {
      return require(file_path_or_object);
    }
    throw new Error('json_model_path should be string: absolute path to file');
  }
  return file_path_or_object;
}

module.exports = {
  get_koa_request_method,
  get_model_file_path,
};
