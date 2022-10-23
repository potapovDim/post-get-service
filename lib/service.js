// @ts-check
const { get_model_file_path } = require('./commons/utils');
const server_routes_app_builder = require('./server_routes');

function run_service(json_model_or_path) {
  return new Promise((res, rej) => {
    const json_model = get_model_file_path(json_model_or_path);

    const PORT = json_model.port || 8081;
    const HOST = json_model.host || '0.0.0.0';

    const { app } = server_routes_app_builder(json_model);

    process.on('uncaughtException', err => {
      rej(err);
    });

    const server = app.listen(PORT, HOST, function (err) {
      if (err) {
        rej(err);
      }
      res({
        stop: async () => {
          return new Promise((_res, _rej) => {
            server.close(function (err) {
              if (err) {
                _rej(err);
              }
              _res(true);
            });
          });
        },
      });
    });
  });
}

module.exports = {
  run_service,
};
