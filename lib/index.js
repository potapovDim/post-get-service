// @ts-check
const { run_service } = require('./service');
const { generate_api_requests } = require('./requests/generate.requests');
const request = require('./commons/request');

module.exports = { run_service, generate_api_requests, request };
