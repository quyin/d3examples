// A simple static web server serving the current folder.

var express = require('express');
var serveIndex = require('serve-index');
var serveStatic = require('serve-static');

var app = express();
app.use(serveIndex('.'));
app.use(serveStatic('.'));

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Static web server listening at http://%s:%s", host, port);
});

