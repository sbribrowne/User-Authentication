var express = require('express');
var router = express.Router();
 
 
// GET route for rendering login page
router.get('/', function(req, res, next) {
  return res.send("working");
});

// GET route for rendering admin user configuration page
router.get('/', function(req, res, next) {
  return res.send("working");
});
 
module.exports = router;