
# scuz

> a restful web server with in-memory storage suitable for prototyping

##### example

```javascript
var http = require('http');
var scuz = require('scuz');
var server = scuz();

http.get('http://localhost:1337/', function(res) {
  var json = '';
  res.on('data', function(data) {
    json += data;
  }).on('end', function() {
    console.log(JSON.parse(json));
    // {
    //   "error": false,
    //   "status": 200,
    //   "message": "ok",
    //   "body": {}
    // }
  });
}).on('error', console.log.bind(console));
```

##### configuration

| environment variable | default     | description                        |
| -------------------- | ----------- | ---------------------------------- |
| `SCUZ_JSON_NAME`     | `scuz.json` | overrides the default storage name |
| `SCUZ_SAVE_INTERVAL` | unset       | interval value in milliseconds     |
| `SCUZ_SAVE_ON_EXIT`  | unset       | save in-memory storage to `scuz.json` on exit |
| `SCUZ_LOAD_STORAGE`  | unset       | load `scuz.json` into memory at bootstrap |
| `SCUZ_PORT`          | `1337`      | port to which the web server will be bound |
