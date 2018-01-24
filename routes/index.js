var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET to rendor welcome page
router.get('/welcome', function(req, res, next) {
  if (! req.session.userId  ) {
    var err = new Error("You are not authorized to view this page.");
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile' });
        }
      });
});

// GET to render logout page
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET to render login page
router.get('/login', function(req, res, next) {
  return res.render('login', { title: 'Log In'});
});

// POST to send login information
router.post('/login', function(req, res, next) {
  if (req.body.staffId && req.body.password) {
    console.log(req.body.staffId)
    User.authenticate(req.body.staffId, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Incorrect ID or password');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = user._id;
        return res.redirect('/welcome');
      }
    });
  } else {
    var err = new Error('ID and password are required');
    err.status = 401;
    return next(err);
  }
});

// GET to register admin configuration page
router.get('/adminconfig', function(req, res, next) {
  return res.render('adminconfig', { title: 'Register Users' });
});

// POST to send information inputted for user functionality
router.post('/adminconfig', function(req, res, next) {
  if (req.body.staffId &&
    req.body.securityRole &&
    req.body.password &&
    req.body.confirmPassword) {

      // confirm that user typed same password twice
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match');
        err.status = 400;
        return next(err);
      }

      // create object with form input
      var userData = {
        staffId: req.body.staffId,
        securityRole: req.body.securityRole,
        password: req.body.password
      };

      // use schema's `create` method to insert document into Mongo
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });

    } else {
      var err = new Error('Please enter ID and password');
      err.status = 400;
      return next(err);
    }
})

// GET /
router.get('/', function(req, res, next) {
  return res.render('index');
});

module.exports = router;
