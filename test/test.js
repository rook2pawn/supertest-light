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

  const comm = request(app);
  comm.get("/user/a1234/messages?language=en")
  .then((res) => {
    t.equals(res.text, "beep", "text is property assigned to response");
    comm.end();
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

  const comm = request(app);
  comm.get("/user/a1234/messages?language=en")
  .then((res) => {
    t.equals(res.text, "beep", "text is property assigned to response");
    comm.end();
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

  const comm = request(app);
  comm.post("/user/a1234/messages?language=en", {num:34})
  .then((res) => {
    t.equals(res.text, "doubled: 68", "postData received and text is property assigned to response");
    comm.end();
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

  const comm = request(app);
  comm.post("/user/a1234/messages?language=en", {num:34})
  .then((res) => {
    t.equals(res.text, "doubled: 68", "postData received and text is property assigned to response");
    comm.close();
  })
});

test("auto fail listen", (t) => {
  const http = require("http");
  t.plan(1);
  http.Server.prototype.listen = function(port, cb) {
    cb(new Error("Cant listen"));
  }
  const express = require("express");
  const app = express();
  const comm = request(app)
  .get("/foo")
  .then(() => {
    console.log("Nope")
  })
  .catch((e) => {
    t.equal(e.message, "Cant listen");
  });
})
