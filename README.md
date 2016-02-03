
# scuz [![Build Status](https://travis-ci.org/skibz/scuz.svg?branch=master)](https://travis-ci.org/skibz/scuz) [![Test Coverage](https://codeclimate.com/github/skibz/scuz/badges/coverage.svg)](https://codeclimate.com/github/skibz/scuz/coverage) [![Code Climate](https://codeclimate.com/github/skibz/scuz/badges/gpa.svg)](https://codeclimate.com/github/skibz/scuz)

> a restful web server with in-memory storage suitable for prototyping

##### example

```javascript
var http = require('http');
var scuz = require('scuz');
var server = scuz();

http.get('http://localhost:1337/', function(res) {
  res.pipe(process.stdout);
  // {"error":false,"status":200,"message":"ok","body":{}}
}).on('error', console.log.bind(console));
```

##### configuration

environment variable | default     | type    | description
-------------------- | ----------- | ------- | -----------
`SCUZ_STORAGE_NAME`  | `scuz.json` | string  | overrides the default storage name
`SCUZ_SAVE_INTERVAL` | unset       | integer | interval value in milliseconds
`SCUZ_SAVE_ON_EXIT`  | unset       | n/a     | save in-memory storage to `scuz.json` on exit
`SCUZ_LOAD_STORAGE`  | unset       | n/a     | load `scuz.json` into memory at bootstrap
`SCUZ_PORT`          | `1337`      | integer | port to which the web server will be bound
