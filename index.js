'use strict';

var express = require('express')
  , Primus = require('primus')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , url = require('url')
  , app = express()
  , wohoos = process.env.WOHOO || 0;

app.set('port', 8080);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index', {
    count: wohoos
  });
});

var server = http.createServer(app)
  , primus = new Primus(server);

primus.on('connection', function connected(spark) {
  //
  // Write to all connections.
  //
  spark.on('data', function received(data) {
    console.log('Received data from %s, wohoos %s', spark.id, ++wohoos);

    primus.write({ count: wohoos });
  });
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});