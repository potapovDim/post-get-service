// @ts-check

/**
 *
 * @param {string} variable_name
 * @returns {string} post_body_string
 */
function build_get_body(variable_name) {
  return `\n
      const item = ${variable_name}.shift() || null;
      ctx.status = 200;
      ctx.body = item
      return ctx
    }
  \n`;
}

module.exports = {
  build_get_body,
};
