var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({message: "Application has been started."})
});

module.exports = router;
