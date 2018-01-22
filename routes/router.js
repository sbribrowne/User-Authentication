var express = require('express');
var router = express.Router();
var User = require('../models/user')

// GET route for rendering login page
router.get('/login', function(req, res, next) {
  return res.render('login', { title: 'Log In'});
});

// POST route for login page
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Incorrect Login');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = user._id;
        return res.redirect('/welcome');
      }
    });
  } else {
    var err = new Error('Username and password are required.');
    err.status = 401;
    return next(err);
  }
});

// GET route for rendering welcome page
router.get('/welcome', function(req, res, next) {
  if (! req.session.userId ) {
    var err = new Error("You are not authorized to view this page.");
    err.status = 403;
    return next(err);
  }

  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('welcome', { title: 'Profile', name: user.name });
        }
      });
});

// GET route for rendering admin user functionality page
router.get('/register', function(req, res, next) {
  return res.render('register', { title: 'Set Up Users' });
});

// POST for user functionality
router.post('/register', function(req, res, next) {
  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.confirmPassword) {

      // confirm that user typed same password twice
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }

      // create object with form input
      var userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      };

      // use schema's `create` method to insert document into Mongo
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/welcome');
        }
      });

    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
})

// GET for logging out
router.get('/logout', function(req, res, next) {
  if (req.session) {

    // delete session
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});
 
module.exports = router;