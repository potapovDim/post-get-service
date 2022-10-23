// @ts-check
const { getRandomString } = require('sat-utils');
const fs = require('fs');

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
  fs_write_async,
  fs_write_sync,
  fs_unlink_sync,
  get_random_file_name,
};
