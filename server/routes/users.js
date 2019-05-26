var express = require('express');
var router = express.Router();

router.post('/login',	function(req, res, next) {
  res.send('Login attempt');
});

module.exports = router;
