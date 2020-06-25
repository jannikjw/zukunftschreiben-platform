const express = require('express');
const LikeController = require('../controllers/LikeController');

const router = express.Router();

router.post('/:project_id', LikeController.createLike);
router.delete('/:project_id', LikeController.deleteLike);

module.exports = router;
