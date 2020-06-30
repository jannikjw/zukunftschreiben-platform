var express = require('express');
const ProjectController = require('../controllers/ProjectController');

var router = express.Router();

// Authentication Required
router.post('/create', ProjectController.createProject);
router.put('/update', ProjectController.updateProject);
router.delete('/delete', ProjectController.deleteProject);
router.get('/getProject/:id', ProjectController.getProject);
router.get('/', ProjectController.getAll);
router.put('/', ProjectController.update);

module.exports = router;