var express = require('express');
var app = express();
const mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');
var Promise = require('bluebird');
var rp = require('request-promise');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


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

var ListSchema = new mongoose.Schema({
    name: String,
    category: String,
    items: [String],
    uses: Number
});

var catSchema = new mongoose.Schema({
    name: String,
    image: String,
    modal: String
});

var Model = mongoose.model('lists', ListsSchema);
var listModel = mongoose.model('list', ListSchema);
var Category = mongoose.model('categories', catSchema);


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
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/tos', function (req, res) {
    res.sendFile(path.join(__dirname + '/tos.html'));
});
app.get('/pp', function (req, res) {
    res.sendFile(path.join(__dirname + '/pp.html'));
});
app.get('/Lists/:query', cors(), function (req, res) {
    var query = req.params.query;
    Model.find({
        'category': query
    },
        null,
        {
            sort: {
                uses: -1
            }
        },
        function (err, result) {
            if (err) throw err;
            if (result) {
                res.json(result)
            } else {
                res.send(JSON.stringify({
                    error: 'Error'
                }))
            }
        })
});

app.get('/Lists/', cors(), function (req, res) {
    Model.find({}, function (err, result) {
        if (err) throw err;
        if (result) {
            res.json(result)
        } else {
            res.send(JSON.stringify({
                error: 'Error'
            }))
        }
    })
});

app.get('/Categories/', cors(), function (req, res) {
    Category.find({}, function (err, result) {
        if (err) throw err;
        if (result) {
            res.json(result)
        } else {
            res.send(JSON.stringify({
                error: 'Error'
            }))
        }
    })
});

app.post('/getList/', function (req, res, next) {
    listModel.findOne({ name: req.body.name }, function (err, result) {
        if (err) throw err;
        if (result) {
            res.json(result)
        } else {
            res.send(JSON.stringify({
                error: 'Error'
            }))
        }
    })
});

app.post('/addList/', function (req, res, next) {
    var list = new listModel({
        name: req.body.name,
        category: req.body.category,
        items: req.body.items,
        uses: req.body.uses
    })
    list.save(function (err, list) {
        if (err) { return next(err) }
        res.json(201, list)
    })
});

app.post('/updateList/', function (req, res, next) {
    var list = new listModel({
        name: req.body.name,
        category: req.body.category,
        items: req.body.items,
        uses: req.body.uses
    })
    listModel.update({ name: req.body.name }, { name: req.body.name, category: req.body.category, items: req.body.items, uses: req.body.uses }, { upsert: true, safe: true }, function (err, list) {
        if (err) { return next(err) }
        res.json(list)
    })

});

app.post('/boom/', function (req, res, next) {
    listModel.update({ name: req.body.name }, { uses: req.body.uses + 1 }, { upsert: true, safe: true }, function (err, list) {
        if (err) { return next(err) }
        res.json(list)
    })

});
app.listen(80);


