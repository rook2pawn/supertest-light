# supertest-light

supertest-light is an ultra-minimalist take on supertest that strives to remove any special syntax that was present in supertest
and keep it strictly in the realm of Promises.

```javascript
  const request = require("supertest-light");

  const app = require("express")();
  app.get("/user/:username/messages", (req,res,next) => {
    return res.end(`Hello ${req.params.username}!`)
  })

  const comm = request(app);
  comm.get("/user/bart/messages")
  .then((res) => {
    t.equals(res.text, "Hello bart!", "text is properly assigned to response");
    comm.end();
  })
```
