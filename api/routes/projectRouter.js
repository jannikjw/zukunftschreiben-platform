var express = require('express');
const ProjectController = require('../controllers/ProjectController');

var router = express.Router();

// Authentication Required
router.post('/create', ProjectController.createProject);

module.exports = router;