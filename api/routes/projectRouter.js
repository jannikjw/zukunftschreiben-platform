var express = require('express');
const ProjectController = require('../controllers/ProjectController');

var router = express.Router();

// Authentication Required
router.post('/create', ProjectController.createProject);
router.get('/getProject', ProjectController.getProject);

module.exports = router;