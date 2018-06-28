| Node 7 | [![Build Status](https://travis-ci.org/rook2pawn/supertest-light.svg?branch=master)](https://travis-ci.org/rook2pawn/supertest-light) |  Node 8 | [![Build Status](https://travis-ci.org/rook2pawn/supertest-light.svg?branch=master)](https://travis-ci.org/rook2pawn/supertest-light) |
|  -     |   -    |  - | - |
| Node 9 | [![Build Status](https://travis-ci.org/rook2pawn/supertest-light.svg?branch=master)](https://travis-ci.org/rook2pawn/supertest-light) | Node 10 | [![Build Status](https://travis-ci.org/rook2pawn/supertest-light.svg?branch=master)](https://travis-ci.org/rook2pawn/supertest-light) |

| Code Coverage | [![Coverage Status](https://coveralls.io/repos/github/rook2pawn/supertest-light/badge.svg?branch=master)](https://coveralls.io/github/rook2pawn/supertest-light?branch=master) |
| - | - |

# supertest-light

supertest-light is an ultra-minimalist take on supertest that strives to remove any special syntax that was present in supertest
and keep it strictly in the realm of Promises.

## .get(path)

```javascript
  const request = require("supertest-light");

  const app = require("express")();
  app.get("/user/:username/messages", (req,res,next) => {
    return res.end(`Hello ${req.params.username}!`)
  })

  const nav = request(app);
  nav.get("/user/bart/messages")
  .then((res) => {
    assert.equals(res.text, "Hello bart!", "text is properly assigned to response");
    nav.end();
  })
```


## .post(path, postData)

```javascript
  const request = require("supertest-light");
  const express = require("express");

  const app = express();
  app.post("/user/:userId/messages", express.json(), (req,res,next) => {
    return res.end(`doubled: ${req.body.num * 2}`)
  })

  const nav = request(app);
  nav.post("/user/a1234/messages?language=en", {num:34})
  .then((res) => {
    assert.equals(res.text, "doubled: 68", "postData received and text is property assigned to response");
    nav.end();
  })

```
