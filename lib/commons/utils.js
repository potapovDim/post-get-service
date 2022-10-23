// @ts-check
const path = require('path');
const fs = require('fs');
const { isString, getRandomString } = require('sat-utils');

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

/** // sync implementation
 * @param {string} fs_path path to file, what should be removed
 * @returns {void}
 */

function fs_unlink_sync(fs_path) {
  fs.unlinkSync(fs_path);
}

/** // sync implementation
 * @param {string} fs_path path to file, where it should be created
 * @param {string} data stringified object ets
 * @returns {void}
 */
function fs_write_sync(fs_path, data) {
  fs.writeFileSync(fs_path, data);
}

/** // async implementation
 * @param {string} fs_path path to file, where it should be created
 * @param {string} data stringified object ets
 * @returns {Promise<void>}
 */
async function fs_write_async(fs_path, data) {
  return new Promise(res => {
    fs.writeFile(fs_path, data, err => {
      if (err) throw new Error('Something wend wrong with file creation process');
      res();
    });
  });
}

const get_random_file_path = (base_path, length = 4) => {
  return `${base_path}${getRandomString(length, { letters: true })}.js`;
};

/**
 * @returns {string}
 */
function get_random_file_name() {
  const base_path = './routs';
  const file_path = get_random_file_path(base_path, 10);
  if (fs.existsSync(file_path)) {
    return get_random_file_name();
  }
  return file_path;
}

module.exports = {
  get_koa_request_method,
  get_model_file_path,
};
