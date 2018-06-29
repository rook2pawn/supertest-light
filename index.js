const http = require("http");
const concat = require("concat-stream");

const request = function(app) {
  let server;
  const headers = {};
  let path;
  let method;
  let postData;
  const obj = {};

  const buildOptions = function(method, port, path) {
    const options = { port, path, method, headers };
    return options;
  };

  const pendingPort = new Promise((resolve, reject) => {
    server = http.createServer(app).listen(0, e => {
      if (e) {
        return reject(e);
      } else {
        return resolve(server.address().port);
      }
    });
  });

  obj.then = function(resolve, reject) {
    var x = new Promise((innerResolve, innerReject) => {
      var close = function(e, _reject) {
        if (server) {
          server.close(() => {
            _reject(e);
          })
        } else {
          _reject(e)
        }
      }
      pendingPort
        .then(port => {
          const req = http.request(buildOptions(method, port, path), res => {
            res.pipe(
              concat(body => {
                res.text = body.toString();
                server.close(() => {
                  innerResolve(res);
                })
              })
            );
          });
          if (method == "POST") {
            req.setHeader("Content-Type", "application/json");
            req.write(JSON.stringify(postData));
          }
          req.on("error",(e) => close(e,innerReject));
          req.end();
        })
        .catch((e) => close(e,innerReject));
    });
    return x.then(resolve, reject);
  };
  obj.set = function(key, value) {
    headers[key] = value;
    return obj;
  };
  obj.get = function(_path) {
    method = "GET";
    path = _path;
    return obj;
  };
  obj.post = function(_path, _postData) {
    method = "POST";
    path = _path;
    postData = _postData;
    return obj;
  };
  return obj;
};

module.exports = exports = request;
