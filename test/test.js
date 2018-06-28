const request = require("..");
const test = require("tape");

test("basic functionality - router-middleware", (t) => {
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

test("basic functionality - express", (t) => {
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
