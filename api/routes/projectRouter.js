var express = require('express');
const ProjectController = require('../controllers/ProjectController');

var router = express.Router();

// Authentication Required
router.post('/', ProjectController.createProject);
router.get('/', ProjectController.getAll);

module.exports = router;