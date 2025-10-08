// index.js
const { createServer } = require("http");

/**
 * Minimal request helper for express/connect-style apps.
 * Node 18+ required (uses global fetch).
 */
function request(app) {
  let server;
  const headers = new Headers();
  let method = "GET";
  let path = "/";
  let bodyData;

  // be reasonable by default
  if (!headers.has("accept")) {
    headers.set("accept", "application/json, text/plain;q=0.9, */*;q=0.8");
  }

  // internal: start ephemeral server and resolve port
  const getPort = () =>
    new Promise((resolve, reject) => {
      server = createServer(app);
      // Bind to loopback to avoid firewall dialogs on some systems
      server.listen(0, "127.0.0.1", () => {
        const addr = server.address();
        if (!addr || typeof addr.port !== "number") {
          reject(new Error("Failed to acquire port"));
        } else {
          console.log("Listening on port", addr.port);
          resolve(addr.port);
        }
      });
      server.on("error", reject);
    });

  // core execution wrapped to make the object "thenable"
  const run = async () => {
    const port = await getPort();
    const url = `http://127.0.0.1:${port}${path}`;

    try {
      let body = undefined;

      // If user passed an object, default to JSON
      if (bodyData !== undefined) {
        if (
          typeof bodyData === "object" &&
          bodyData !== null &&
          !(bodyData instanceof Buffer) &&
          !(bodyData instanceof Uint8Array)
        ) {
          if (!headers.has("content-type")) {
            headers.set("content-type", "application/json");
          }
          body = JSON.stringify(bodyData);
        } else {
          body = bodyData;
        }
      }

      const res = await fetch(url, {
        method,
        headers,
        body,
      });

      const text = await res.text();
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      const isJSON = ct.startsWith("application/json");
      let parsed;
      if (isJSON && text !== "") {
        try {
          parsed = JSON.parse(text);
        } catch {
          /* leave undefined */
        }
      }
      const out = {
        statusCode: res.status,
        headers: Object.fromEntries(res.headers),
        text,
        body: parsed,
      };
      return out;
    } finally {
      // Always close to free the ephemeral port
      if (server) {
        await new Promise((r) => server.close(r));
      }
    }
  };

  // Build a tiny chainable interface
  const api = {
    set(key, value) {
      headers.set(key, value);
      return api;
    },
    get(_path) {
      method = "GET";
      path = _path;
      bodyData = undefined;
      return api;
    },
    post(_path, _body) {
      method = "POST";
      path = _path;
      bodyData = _body;
      return api;
    },
    // Optional: generic method if you ever want it
    send(_method, _path, _body) {
      method = _method.toUpperCase();
      path = _path;
      bodyData = _body;
      return api;
    },
    // Make it awaitable like a Promise
    then(onFulfilled, onRejected) {
      return run().then(onFulfilled, onRejected);
    },
    catch(onRejected) {
      return run().catch(onRejected);
    },
    finally(onFinally) {
      return run().finally(onFinally);
    },
  };

  return api;
}

module.exports = request;
module.exports.default = request;
