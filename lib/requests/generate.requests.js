// @ts-check
const { camelize } = require('sat-utils');
const path = require('path');
const fs = require('fs');
const { get_model_file_path } = require('../commons/utils');

const AVAILABLE_TYPES = new Set(['js', 'ts']);

function get_require_block(type) {
  if (type === 'js') {
    return `const { request } = require('post-get-service');
const { safeHasOwnPropery } = require('sat-utils');
`;
  } else if (type === 'ts') {
    return `import { request } from 'post-get-service';
import { safeHasOwnPropery } from 'sat-utils';`;
  } else {
    throw new TypeError('type should be "js" or "ts"');
  }
}

function get_export_block(type, call_signatures, camel_case_output) {
  const is_available = camel_case_output ? 'isAvailable' : 'is_available';
  if (type === 'js') {
    return `module.exports = {
      ${is_available},
      ${call_signatures.join(',\n')}
    }`;
  } else if (type === 'ts') {
    return `export {
      ${is_available},
      ${call_signatures.join(',\n')}
    }`;
  } else {
    throw new TypeError('type should be "js" or "ts"');
  }
}

/**
 *
 * @param {string} url url
 * @param {boolean} camel_case_output should be in camel case or snake
 * @returns {string} is avaliable service call
 */
function create_is_available(url, camel_case_output) {
  const signature = camel_case_output ? 'isAvailable' : 'is_available';
  return `

  async function ${signature}() {
    const result = await request.get('${url}');

    return safeHasOwnPropery(result, 'live') && result.live;
  };

`;
}

function create_post_req(call_signature, url) {
  return `async function ${call_signature} (data) {
    return request.post('${url}', data)
  };`;
}

function create_get_req(call_signature, url) {
  return `async function ${call_signature} () {
    return request.get('${url}')
  };`;
}

function get_output_path(output_file_path) {
  return path.isAbsolute(output_file_path) ? output_file_path : path.resolve(process.cwd(), output_file_path);
}

/**
 *
 * @param {string} host
 * @param {string|number} port
 * @param {string} path
 * @returns {string} url with path
 */
function create_request_url(host, port, path = '/') {
  return `http://${host}:${port}${path}`;
}

/**
 * @param {!{host: string; port: string|number; api: {path: string}[]}} json_model_or_path api model
 * @param {'js'|'ts'} type output api types
 * @param {string} output_file_path path to outupu api file
 * @param {boolean} camel_case_output should be in camel case or snake
 */
function generate_api_requests(json_model_or_path, type = 'js', output_file_path, camel_case_output) {
  if (!AVAILABLE_TYPES.has(type)) {
    throw new TypeError('type should be "js" or "ts"');
  }

  const json_model = get_model_file_path(json_model_or_path);

  const PORT = json_model.port || 8081;
  const HOST = json_model.host || '0.0.0.0';

  const { api } = json_model_or_path;

  const signatures = [];

  const interactions = api.reduce((current_model, { path }) => {
    const str_path = path.replace(/[^\d A-Za-z]/g, ' ').toLowerCase();

    const post_signature_base = `create data${str_path}`;
    const get_signature_base = `get data${str_path}`;

    const post_signature = camel_case_output ? camelize(post_signature_base) : post_signature_base.replace(/ /gi, '_');
    const get_signature = camel_case_output ? camelize(get_signature_base) : get_signature_base.replace(/ /gi, '_');

    const req_url = create_request_url(HOST, PORT, path);

    signatures.push(post_signature, get_signature);

    const set_data = create_post_req(post_signature, req_url);
    const get_data = create_get_req(get_signature, req_url);

    current_model += '\n' + set_data;
    current_model += '\n' + get_data;

    return current_model;
  }, create_is_available(create_request_url(HOST, PORT), camel_case_output));

  const require_block = get_require_block(type);
  const export_block = get_export_block(type, signatures, camel_case_output);

  const interactions_template = `${require_block}
${interactions}
${export_block}`;

  fs.writeFileSync(get_output_path(output_file_path), interactions_template, { encoding: 'utf8' });
}

module.exports = {
  generate_api_requests,
};
