var express = require('express');
var router = express.Router();
var cors = require('cors');
var path = require('path');
var Model = require('../Models/lists');
var listModel = require('../Models/list');
var Category = require('../Models/category');
var User = require('../models/user');

//POST route for updating data
router.post('/', function (req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      res.send("passwords dont match");
      return next(err);
    }
  
    if (req.body.email &&
      req.body.username &&
      req.body.password &&
      req.body.passwordConf) {
  
      var userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      }
  
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });
  
    } else if (req.body.logemail && req.body.logpassword) {
      User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
  })
  
  // GET route after registering
  router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          if (user === null) {
            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err);
          } else {
            res.sendFile(path.join(__dirname + './../index.html'));
          }
        }
      });
  });
  
  // GET for logout logout
  router.get('/logout', function (req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  });

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});

router.get('/Lists/:query', cors(), function (req, res) {
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

router.get('/Lists/', cors(), function (req, res) {
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

router.get('/Categories/', cors(), function (req, res) {
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

router.post('/getList/', function (req, res, next) {
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

router.post('/addList/', function (req, res, next) {
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

router.post('/updateList/', function (req, res, next) {
    var list = new listModel({
        name: req.body.name,
        category: req.body.category,
        items: req.body.items,
        uses: req.body.uses
    })
    listModel.update({ name: req.body.name }, 
                            { name: req.body.name, category: req.body.category, items: req.body.items, uses: req.body.uses }, 
                            { upsert: true, safe: true }, 
                            function (err, list) {
                                if (err) { 
                                    return next(err) 
                                }
                                res.json(list)
    })

});

router.post('/boom/', function (req, res, next) {
    listModel.update({ name: req.body.name }, 
                            { uses: req.body.uses + 1 }, 
                            { upsert: true, safe: true }, 
                            function (err, list) {
                                if (err) { 
                                    return next(err) 
                                }
                                res.json(list)
    })

});

router.post('/favorite/', function (req, res, next) {
    if(req.body.user.favorites){
        req.body.user.favorites.push(req.body.listToFav);
        User.update({ name: req.body.user.username }, 
            { favorites: req.body.listToFav }, 
            { upsert: true, safe: true }, 
            function (err, list) {
                if (err) { 
                    return next(err) 
                }
                res.json(list)
        })
    }
    else{
        var favs = [];
        favs.push(req.body.listToFav);
        User.update({ name: req.body.user.username }, 
            { favorites: favs }, 
            { upsert: true, safe: true }, 
            function (err, list) {
                if (err) { 
                    return next(err) 
                }
                res.json(list)
        })
    }
    

});

module.exports = router;