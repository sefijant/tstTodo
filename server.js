var express = require('express');
var app = express();
const mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');
var Promise = require('bluebird');
var rp = require('request-promise');

var ObjectId = require('mongodb').ObjectID;
const mongoURL = "mongodb://todobomdb:TuzLJr7l4azXSM3Z06DzFZfe3MPg4DErOF9cFNxsNv9LV5lsUAjych7VC6lj5YZS4GpUplf4huBkHOSSrZLTNQ==@todobomdb.documents.azure.com:10255/?ssl=true";

var ListsSchema = new mongoose.Schema({
    lists: [{
        name: String,
        category: String,
        items: [String],
        uses: Number
        }]
});
var Model = mongoose.model('lists', ListsSchema);


// Connect to mongoDB database assuming our database name is "angular-app"
// const mongoURL = 'mongodb://localhost/angular-app';
 //mongoose.connect(mongoURL);

 mongoose.connect('mongodb://todobomdb.documents.azure.com:10255/ToDoBom?ssl=true', {
    auth: {
      user: 'todobomdb',
      password: 'TuzLJr7l4azXSM3Z06DzFZfe3MPg4DErOF9cFNxsNv9LV5lsUAjych7VC6lj5YZS4GpUplf4huBkHOSSrZLTNQ=='
    }
  })
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));
  mongoose.Promise = global.Promise;

app.use(express.static(__dirname + '/'));
// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/Lists/:query', cors(), function(req, res) {    
        var query = req.params.query;
		Model.find({
			'category': query
		}, function(err, result) {
            if (err) throw err;
            if (result) {
                res.json(result)
            } else {
                res.send(JSON.stringify({
                    error : 'Error'
                }))
            }
        })
    });

app.listen(80);

 