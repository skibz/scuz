
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

* `SCUZ_JSON_NAME` - overrides the default storage name, `scuz.json`.
* `SCUZ_SAVE_INTERVAL` - if unset, `scuz.json` will not be persisted to disk at timely intervals. interval value is milliseconds. **unset** by default.
* `SCUZ_SAVE_ON_EXIT` - save in-memory storage to `scuz.json` on exit. **unset** by default.
* `SCUZ_LOAD_STORAGE` - load `scuz.json` into memory at bootstrap.
* `SCUZ_PORT` - port to which the web server will be bound. set to **1337** by default.
