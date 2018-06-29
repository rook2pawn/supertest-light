const request = require("..");
const test = require("tape");

test("get - router-middleware", (t) => {
  t.plan(3);
  const app = require("router-middleware")();
  app.get("/user/:userId/messages", (req,res,next) => {
    t.deepEquals(req.query, {language:"en"}, "Querystring is received");
    t.equals(req.params.userId, "a1234", "path parameters is received");
    return res.end("beep")
  })
  request(app)
  .get("/user/a1234/messages?language=en")
  .then((res) => {
    t.equals(res.text, "beep", "text is property assigned to response");
  })
  .catch((e) => {
    console.log("caught e:", e);
  })

});

test("get - express", (t) => {
  t.plan(3);
  const app = require("express")();
  app.get("/user/:userId/messages", (req,res,next) => {
    t.deepEquals(req.query, {language:"en"}, "Querystring is received");
    t.equals(req.params.userId, "a1234", "path parameters is received");
    return res.end("beep")
  })

  request(app)
  .get("/user/a1234/messages?language=en")
  .then((res) => {
    t.equals(res.text, "beep", "text is property assigned to response");
  })
});

test("post - router-middleware", (t) => {
  t.plan(3);
  const Router = require("router-middleware");
  const app = Router();
  app.post("/user/:userId/messages", Router.bodyParser, (req,res,next) => {
    t.deepEquals(req.query, {language:"en"}, "Querystring is received");
    t.equals(req.params.userId, "a1234", "path parameters is received");
    return res.end(`doubled: ${req.body.num * 2}`)
  })

  request(app)
  .post("/user/a1234/messages?language=en", {num:34})
  .then((res) => {
    t.equals(res.text, "doubled: 68", "postData received and text is property assigned to response");
  })
});


test("post - express", (t) => {
  t.plan(3);
  const express = require("express");
  const app = express();
  app.post("/user/:userId/messages", express.json(), (req,res,next) => {
    t.deepEquals(req.query, {language:"en"}, "Querystring is received");
    t.equals(req.params.userId, "a1234", "path parameters is received");
    return res.end(`doubled: ${req.body.num * 2}`)
  })

  request(app)
  .post("/user/a1234/messages?language=en", {num:34})
  .then((res) => {
    t.equals(res.text, "doubled: 68", "postData received and text is property assigned to response");
  })
});


test("set headers", (t) => {
  t.plan(4);
  const app = require("express")();
  app.get("/user/:userId/messages", (req,res,next) => {
    t.equals(req.headers['user-agent'], "Supertest-light")
    t.deepEquals(req.query, {language:"en"}, "Querystring is received");
    t.equals(req.params.userId, "a1234", "path parameters is received");
    return res.end("beep")
  })

  request(app)
  .set("User-Agent", "Supertest-light")
  .get("/user/a1234/messages?language=en")
  .then((res) => {
    t.equals(res.text, "beep", "text is property assigned to response");
  })

});


test("fail - listen", (t) => {
  const http = require("http");
  t.plan(1);
  const restore = http.Server.prototype.listen
  http.Server.prototype.listen = function(port, cb) {
    cb(new Error("Cant listen"));
  }
  const express = require("express");
  const app = express();
  request(app)
  .get("/foo")
  .then(() => {
    console.log("Nope")
  })
  .catch((e) => {
    t.equal(e.message, "Cant listen");
  })
  .then(() => {
    http.Server.prototype.listen = restore;
  })
})

test("fail - force error on socket", (t) => {
  t.plan(1)
  const express = require("express");
  const app = express();
  app.get("/foo", (req) => {
    req.socket.destroy();
  })
  request(app)
  .get("/foo")
  .then(() => {
    console.log("Nope")
  })
  .catch((e) => {
    t.equal(e.message, "socket hang up");
  });
})
