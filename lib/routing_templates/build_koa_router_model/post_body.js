// @ts-check
/**
 *
 * @param {string} variable_name
 * @returns {string} post_body_string
 */
function build_post_body(variable_name) {
  return `\n
      const request_body = ctx.request.body;
      ${variable_name}.push(request_body);
      ctx.status = 200;
      ctx.body = { status: 'OK' };
      return ctx
    }
  \n`;
}

module.exports = {
  build_post_body,
};
