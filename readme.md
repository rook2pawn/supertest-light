| Node 7  | [![Build Status](https://travis-ci.org/rook2pawn/supertest-light.svg?branch=master)](https://travis-ci.org/rook2pawn/supertest-light) | Node 8  | [![Build Status](https://travis-ci.org/rook2pawn/supertest-light.svg?branch=master)](https://travis-ci.org/rook2pawn/supertest-light) |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Node 9  | [![Build Status](https://travis-ci.org/rook2pawn/supertest-light.svg?branch=master)](https://travis-ci.org/rook2pawn/supertest-light) | Node 10 | [![Build Status](https://travis-ci.org/rook2pawn/supertest-light.svg?branch=master)](https://travis-ci.org/rook2pawn/supertest-light) |
| Node 11 | [![Build Status](https://travis-ci.org/rook2pawn/supertest-light.svg?branch=master)](https://travis-ci.org/rook2pawn/supertest-light) | Node 12 | [![Build Status](https://travis-ci.org/rook2pawn/supertest-light.svg?branch=master)](https://travis-ci.org/rook2pawn/supertest-light) |
| Node 13 | [![Build Status](https://travis-ci.org/rook2pawn/supertest-light.svg?branch=master)](https://travis-ci.org/rook2pawn/supertest-light) |         |                                                                                                                                       |

| Code Coverage | [![Coverage Status](https://coveralls.io/repos/github/rook2pawn/supertest-light/badge.svg?branch=master)](https://coveralls.io/github/rook2pawn/supertest-light?branch=master) |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |


# supertest-light

supertest-light is

- an ultra-minimalist take on [supertest](https://github.com/visionmedia/supertest/)
- much smaller
- and removes idiosyncratic aspects such as `expect`

## .get(path)

```javascript
const request = require("supertest-light");
const assert = require("assert");
const app = require("express")();

app.get("/user/:username/messages", (req, res, next) => {
  assert.equal(req.headers["user-agent"], "Supertest-Light");
  return res.end(`Hello ${req.params.username}!`);
});

request(app)
  .set("User-Agent", "Supertest-Light")
  .get("/user/bart/messages")
  .then(res => {
    assert.equal(res.text, "Hello bart!");
  });
```

## .post(path, postData)

```javascript
const request = require("supertest-light");
const express = require("express");
const assert = require("assert");

const app = express();
app.post("/user/:userId/messages", express.json(), (req, res, next) => {
  return res.end(`doubled: ${req.body.num * 2}`);
});

request(app)
  .post("/user/a1234/messages?language=en", { num: 34 })
  .then(res => {
    assert.equal(
      res.text,
      "doubled: 68",
      "postData received and text is property assigned to response"
    );
  });
```
