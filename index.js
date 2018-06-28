const http = require("http");
const concat = require("concat-stream");

const throwListen = function(e) { throw e };
const buildOptions = function(method, port, path) {
  const options = { port, path, method };
  return options;
};
const request = function(app) {
  let server;
  const pendingPort = new Promise((resolve,reject) => {
    server = http.createServer(app).listen(0, (e) => {
      if (e) {
        return reject(e)
      } else {
        return resolve(server.address().port);
      }
    });
  });
  return {
    get: function(path) {
      return new Promise((resolve, reject) => {
        pendingPort.then((port) => {
          const req = http.request(buildOptions("GET", port, path), (res) => {
            res.pipe(concat((body) => {
              res.text = body.toString();
              resolve(res)
            }))
          })
          req.on('error', reject)
          req.end();
        }).catch(throwListen)
      });
    },
    post: function(path, postData) {
      return new Promise((resolve, reject) => {
        pendingPort.then((port) => {
          const req = http.request(buildOptions("POST", port, path), (res) => {
            res.pipe(concat((body) => {
              res.text = body.toString();
              resolve(res)
            }))
          })
          req.on('error', reject)
          req.write(postData);
          req.end();
        }).catch(throwListen)
      })
    },
    end : function() {
      server.close();
    },
    close : function() {
      server.close();
    }
  }
}

module.exports = exports = request;
