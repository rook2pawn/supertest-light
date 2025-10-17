# supertest-light

supertest-light is

- an ultra-minimalist take on [supertest](https://github.com/visionmedia/supertest/)
- much smaller
- and removes idiosyncratic aspects such as `expect`

## usage

Example

```ts
(async () => {
  const res = await request(app)
    .set("User-Agent", "Supertest-Light")
    .get("/user/bart/messages");

  assert.equal(res.text, "Hello bart!");
})();
```

Note that `.get`, `.post`, and `.send` are all terminals that return a promise.
