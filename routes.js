var express = require('express');
var router = express.Router();
 
 
// GET route for getting all of the users
router.get('/', function(req, res, next) {
  return res.send("working");
});

// POST route for saving all of the users
// app.post("/api/todos", function(req, res) {
// 	orm.addTodo(req.body, function(results) {
//       res.json(results);
//     });
// });
 
module.exports = router;