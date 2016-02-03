
'use strict';

var SCUZ_SAVE_ON_EXIT = process.env.SCUZ_SAVE_ON_EXIT || false;
var SCUZ_LOAD_STORAGE = process.env.SCUZ_LOAD_STORAGE || false;
var SCUZ_STORAGE_NAME = process.env.SCUZ_STORAGE_NAME || 'scuz.json';
var SCUZ_SAVE_INTERVAL = process.env.SCUZ_SAVE_INTERVAL || false;
var SCUZ_PORT = process.env.SCUZ_PORT || process.env.PORT || 1337;

var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var express = require('express');
var morgan = require('morgan');
var cors = require('cors');
var path = require('path');
var fs = require('fs');

var storagePath = path.join(__dirname, SCUZ_STORAGE_NAME);
var scuz = express();

scuz.use(morgan('dev'));
scuz.use(cors());
scuz.use(methodOverride());
scuz.use(bodyParser.json());
scuz.use(bodyParser.urlencoded({extended: true}));
scuz.use(function(err, req, res, next) {
  if (!err) return next();
  res.status(400).json({
    error: true,
    status: 400,
    message: 'invalid json',
    body: null
  });
});

scuz.get('/', function(req, res) {
  res.status(200).json({
    error: false,
    status: 200,
    message: 'ok',
    body: scuz.get('storage')
  });
});

scuz.put('/', function(req, res) {
  scuz.set('storage', req.body || {});
  res.status(200).json({
    error: false,
    status: 200,
    message: 'ok',
    body: scuz.get('storage')
  });
});

scuz.delete('/', function(req, res) {
  scuz.set('storage', {});
  res.status(200).json({
    error: false,
    status: 200,
    message: 'ok',
    body: scuz.get('storage')
  });
});

scuz.get('/:resource', function(req, res) {
  var storage = scuz.get('storage');
  if (req.params.resource in storage) {
    res.status(200).json({
      error: false,
      status: 200,
      message: 'ok',
      body: storage[req.params.resource]
    });
  } else {
    res.status(404).json({
      error: true,
      status: 404,
      message: 'resource type not found',
      body: null
    });
  }
});

scuz.get('/:resource/:id', function(req, res) {
  var storage = scuz.get('storage');
  if (req.params.resource in storage) {
    var resource = storage[req.params.resource];
    if (req.params.id in resource) {
      res.status(200).json({
        error: false,
        status: 200,
        message: 'ok',
        body: resource[req.params.id]
      });
    } else {
      res.status(404).json({
        error: true,
        status: 404,
        message: 'record not found',
        body: null
      });
    }
  } else {
    res.status(404).json({
      error: true,
      status: 404,
      message: 'resource type not found',
      body: null
    });
  }
});

scuz.post('/:resource', function(req, res) {
  var storage = scuz.get('storage');
  var resource, id = Date.now();
  if (!(req.params.resource in storage)) {
    storage[req.params.resource] = {};
  }
  resource = storage[req.params.resource];
  resource[id] = req.body;
  res.status(201).json({
    error: false,
    status: 201,
    message: 'created',
    body: resource[id]
  });
});

scuz.put('/:resource/:id', function(req, res) {
  var storage = scuz.get('storage');
  if (req.params.resource in storage) {
    var resource = storage[req.params.resource];
    if (req.params.id in resource) {
      resource[req.params.id] = req.body;
      return res.status(200).json({
        error: false,
        status: 200,
        message: 'ok',
        body: resource[req.params.id]
      });
    } else {
      res.status(404).json({
        error: true,
        status: 404,
        message: 'record not found',
        body: null
      });
    }
  } else {
    res.status(404).json({
      error: true,
      status: 404,
      message: 'resource type not found',
      body: null
    });
  }
});

scuz.delete('/:resource', function(req, res) {
  var storage = scuz.get('storage');
  if (req.params.resource in storage) {
    delete storage[req.params.resource];
    res.status(200).json({
      error: false,
      status: 200,
      message: 'ok',
      body: null
    });
  } else {
    res.status(404).json({
      error: true,
      status: 404,
      message: 'resource type not found',
      body: null
    });
  }
});

scuz.delete('/:resource/:id', function(req, res) {
  var storage = scuz.get('storage');
  if (req.params.resource in storage) {
    if (req.params.id in storage[req.params.resource]) {
      delete storage[req.params.resource][req.params.id];
      res.status(200).json({
        error: false,
        status: 200,
        message: 'ok',
        body: null
      });
    } else {
      res.status(404).json({
        error: true,
        status: 404,
        message: 'record not found',
        body: null
      });
    }
  } else {
    res.status(404).json({
      error: true,
      status: 404,
      message: 'resource type not found',
      body: null
    });
  }
});

if (SCUZ_SAVE_INTERVAL) {
  try {
    var saveTimer = setInterval(function() {
      fs.createWriteStream(
        storagePath
      ).end(
        JSON.stringify(scuz.get('storage')), function() {
        console.log('[scuz info] wrote storage to disk!');
      });
    }, parseInt(SCUZ_SAVE_INTERVAL, 10));
  } catch (ex) {
    console.error('[scuz error] SCUZ_SAVE_INTERVAL (%s) is not a number!', SCUZ_SAVE_INTERVAL);
  }
}

process.on('uncaughtException', function(err) {
  console.error('[scuz error] uncaught exception', err);
}).on('unhandledRejection', function(err) {
  console.error('[scuz error] unhandled rejection', err);
}).on('exit', function(code) {
  if (!SCUZ_SAVE_ON_EXIT) return;
  console.log('[scuz info] writing json to disk...');
  fs.writeFileSync(storagePath, JSON.stringify(scuz.get('storage')));
  console.log('[scuz info] ...done!')
  console.log('[scuz info] about to exit with code', code);
});

scuz.set('storage', SCUZ_LOAD_STORAGE && fs.existsSync(storagePath) ? require('./' + storagePath) : {});

module.exports = scuz.listen.bind(scuz, SCUZ_PORT, function() {
  console.log('[scuz info] http://localhost:%s', SCUZ_PORT);
});
