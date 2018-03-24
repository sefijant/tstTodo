var express = require('express');
var app = express();
const mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var cors = require('cors');
var Promise = require('bluebird');
var rp = require('request-promise');
var bodyParser = require('body-parser');
var router = require('./Routers/router');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://todobomdb.documents.azure.com:10255/ToDoBom?ssl=true', {
    auth: {
        user: 'todobomdb',
        password: 'TuzLJr7l4azXSM3Z06DzFZfe3MPg4DErOF9cFNxsNv9LV5lsUAjych7VC6lj5YZS4GpUplf4huBkHOSSrZLTNQ=='
    }
})
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));
mongoose.Promise = global.Promise;
var db = mongoose.connection;

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  }));

app.use(express.static(__dirname + '/'));
app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  // define as the last app.use callback
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });

app.listen(80);


