// @ts-check
const { isString, safeHasOwnPropery } = require('sat-utils');
const http = require('http');
const https = require('https');

const MAX_AVAILABLE_RETRIES = 2;

function is_retryable_network_error(err) {
  if (err && err.code) {
    return (
      err.code === 'ECONNABORTED' ||
      err.code === 'ECONNRESET' ||
      err.code === 'ECONNREFUSED' ||
      err.code === 'EADDRINUSE' ||
      err.code === 'EPIPE' ||
      err.code === 'ETIMEDOUT'
    );
  }

  return false;
}

function should_reexecute_request(retries, err) {
  return retries < MAX_AVAILABLE_RETRIES && is_retryable_network_error(err);
}

/**
 *
 * @param {*} options
 * @param {*} handle_result
 * @param {*} request_data
 * @param {number} retry_call_number
 */
function send_request(options, handle_result, request_data, retry_call_number = 0) {
  const req = options.protocol === 'https:' ? https.request : http.request;
  const called_request = req(options, function (response) {
    const body = [];

    response.on('data', body.push.bind(body));
    response.on('end', function () {
      const resp = Buffer.concat(body).toString('utf8').replace(/\0/g, '');
      handle_result({ req_result: resp });
    });
  });

  called_request.on('error', function (error) {
    if (should_reexecute_request(retry_call_number, error)) {
      retry_call_number += 1;
      setTimeout(function () {
        send_request(options, handle_result, request_data, retry_call_number);
      }, 25);
    } else {
      handle_result({ req_error: error });
    }
  });

  if (request_data) {
    called_request.write(isString(request_data) ? request_data : JSON.stringify(request_data));
  }

  called_request.end();
}

/**
 *
 * @param {string} url
 * @param {'POST'|'GET'} method
 * @param {*} headers
 * @returns {{
 *   host,
 *   port,
 *   path,
 *   protocol,
 *   href,
 *   headers,
 *   method,
 * }}
 */
function prepare_request_opts(url, method, headers = {}) {
  const { host, port, pathname, protocol, href } = new URL(url);

  const hostwithoutPort = host.endsWith(`:${port}`) ? host.replace(`:${port}`, '') : host;

  return {
    host: hostwithoutPort,
    port,
    path: pathname,
    protocol,
    href,
    headers,
    method,
  };
}

/**
 *
 * @param {*} opts
 * @param {*} [data]
 * @returns {Promise<any>}
 */
async function handle_request(opts, data) {
  return new Promise(resolve => {
    if (opts.method === 'GET') {
      data = undefined;
    }

    send_request(opts, resolve, data);
  });
}

function try_parse_json(item) {
  try {
    return JSON.parse(item);
  } catch {
    return item;
  }
}

/**
 * @param {string} url request url
 * @param {!{[k: string]: string}} [headers] request headers
 */
async function get(url, headers = {}) {
  const request_opts = prepare_request_opts(url, 'GET', headers);

  const result = await handle_request(request_opts);

  if (safeHasOwnPropery(result, 'req_result')) {
    return isString(result.req_result) ? try_parse_json(result.req_result) : result.req_result;
  }

  return result.req_error;
}

/**
 * @param {string} url request url
 * @param {!{[k: string]: string}} [headers] request headers
 */
async function post(url, data, headers = {}) {
  const request_opts = prepare_request_opts(url, 'POST', headers);

  const result = await handle_request(request_opts, data);

  if (safeHasOwnPropery(result, 'req_result')) {
    return isString(result.req_result) ? try_parse_json(result.req_result) : result.req_result;
  }

  return result.req_error;
}

module.exports = {
  get,
  post,
};
