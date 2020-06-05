var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.json({ status: 1, message: 'Zukunftschreiben Donation API says "Hello World!"' });
});

module.exports = router;

