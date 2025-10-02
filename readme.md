# supertest-light

supertest-light is

- an ultra-minimalist take on [supertest](https://github.com/visionmedia/supertest/)
- much smaller
- and removes idiosyncratic aspects such as `expect`

## usage

Example

```js
const request = require("supertest-light");
const assert = require("assert");
const express = require("express");

const app = express();
app.get("/user/:username/messages", (req, res) => {
  assert.equal(req.headers["user-agent"], "Supertest-Light");
  res.end(`Hello ${req.params.username}!`);
});

(async () => {
  const res = await request(app)
    .set("User-Agent", "Supertest-Light")
    .get("/user/bart/messages");
  assert.equal(res.text, "Hello bart!");
})();
```

Example

```js
const request = require("supertest-light");
const express = require("express");
const assert = require("assert");

const app = express();
app.post("/user/:userId/messages", express.json(), (req, res) => {
  res.end(`doubled: ${req.body.num * 2}`);
});

(async () => {
  const res = await request(app).post("/user/a1234/messages?language=en", {
    num: 34,
  });
  assert.equal(res.text, "doubled: 68");
})();
```
